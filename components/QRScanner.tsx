"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT } from "@/utils/event";
import { KIND_LABEL, childrenLabel, displayTitle, formatPhone, type Entry } from "@/utils/entry";

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "checking" }
  | { status: "success"; entry: Entry }
  | { status: "already_scanned"; entry: Entry }
  | { status: "invalid"; scanned: string }
  | { status: "error"; id: string; message: string }
  | { status: "camera_error"; message: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function scannedAt(entry: Entry): string | null {
  if (!entry.checked_in_at) return null;
  return new Date(entry.checked_in_at).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function GuestDetails({ entry }: { entry: Entry }) {
  const kids = childrenLabel(entry);
  return (
    <div className="result__who">
      <span className="badge">{KIND_LABEL[entry.kind]}</span>
      <p className="name">{displayTitle(entry)}</p>
      {entry.kind === "stall" && (
        <>
          {kids && <p>{kids}</p>}
          {entry.category && <p>{entry.category}</p>}
          <p>Parent / guardian: {entry.name}</p>
        </>
      )}
      <p>{formatPhone(entry.number)}</p>
      <p>{entry.email}</p>
    </div>
  );
}

// Scanning a pass checks the guest in immediately. The API only flips
// checkedin false → true, so a second scan (from any device) comes back
// as "already scanned".
export default function QRScanner() {
  const scannerRef = useRef<InstanceType<typeof import("html5-qrcode").Html5Qrcode> | null>(null);
  const isProcessing = useRef(false);
  const [state, setState] = useState<ScanState>({ status: "idle" });

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      // ignore stop errors
    }
  }, []);

  const checkIn = useCallback(async (id: string) => {
    setState({ status: "checking" });
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "PATCH" });
      const body = await res.json();
      if (res.ok) {
        navigator.vibrate?.(120);
        setState({ status: "success", entry: body });
      } else if (res.status === 409 && body.entry) {
        navigator.vibrate?.([120, 80, 120, 80, 120]);
        setState({ status: "already_scanned", entry: body.entry });
      } else if (res.status === 404) {
        setState({ status: "invalid", scanned: id });
      } else {
        setState({ status: "error", id, message: body.error || "Check-in failed" });
      }
    } catch {
      setState({ status: "error", id, message: "Couldn't reach the server. Check the connection and retry." });
    }
  }, []);

  // Start the camera once the #qr-reader element is on screen; stop it
  // whenever we leave the scanning state.
  useEffect(() => {
    if (state.status !== "scanning") return;
    let cancelled = false;
    isProcessing.current = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (isProcessing.current) return;
            isProcessing.current = true;
            const id = decodedText.trim();
            if (UUID_RE.test(id)) {
              checkIn(id);
            } else {
              setState({ status: "invalid", scanned: id });
            }
          },
          undefined
        );
        if (cancelled) stopScanner();
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "camera_error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [state.status, checkIn, stopScanner]);

  const scanNext = () => setState({ status: "scanning" });

  return (
    <div className="stack">
      {state.status === "idle" && (
        <div className="acard" style={{ textAlign: "center", padding: "44px 24px" }}>
          <p style={{ fontFamily: "var(--f-head)", fontSize: 26 }}>Ready at the door?</p>
          <p style={{ color: "var(--muted)", margin: "8px auto 0", maxWidth: 320 }}>
            Point the camera at a pass. It&apos;s checked in the moment it scans.
          </p>
          <button onClick={scanNext} className="btn" style={{ marginTop: 24 }}>
            Start scanning
          </button>
        </div>
      )}

      {state.status === "scanning" && (
        <div className="stack-sm">
          <div id="qr-reader" />
          <button onClick={() => setState({ status: "idle" })} className="btn btn--ghost btn--block">
            Stop camera
          </button>
        </div>
      )}

      {state.status === "checking" && (
        <div className="acard" style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="spinner" />
          <p style={{ color: "var(--muted)", marginTop: 14 }}>Checking pass…</p>
        </div>
      )}

      {state.status === "success" && (
        <div className="result result--ok" role="status">
          <div className="result__head">
            <span className="result__icon">✓</span>
            <div>
              <h2>Success</h2>
              <p className="result__sub">Checked in · {scannedAt(state.entry)}</p>
            </div>
          </div>
          <GuestDetails entry={state.entry} />
        </div>
      )}

      {state.status === "already_scanned" && (
        <div className="result result--warn" role="alert">
          <div className="result__head">
            <span className="result__icon">!</span>
            <div>
              <h2>Already scanned</h2>
              <p className="result__sub">
                {scannedAt(state.entry) ? `First scanned at ${scannedAt(state.entry)}` : "This pass has been used"}
              </p>
            </div>
          </div>
          <GuestDetails entry={state.entry} />
        </div>
      )}

      {state.status === "invalid" && (
        <div className="acard" style={{ borderLeft: "5px solid #c0392b" }} role="alert">
          <p style={{ fontFamily: "var(--f-head)", fontSize: 24, color: "#c0392b" }}>Not a valid pass</p>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>This QR code isn&apos;t a {EVENT.name} registration.</p>
          <p style={{ marginTop: 10, wordBreak: "break-all", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#8a98a0" }}>
            {state.scanned}
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div className="stack-sm">
          <div className="alert-error">{state.message}</div>
          <button onClick={() => checkIn(state.id)} className="btn btn--block">
            Retry check-in
          </button>
        </div>
      )}

      {state.status === "camera_error" && (
        <div className="alert-error">
          Couldn&apos;t start the camera — allow camera access for this site and try again.
          <span style={{ display: "block", marginTop: 4, fontSize: 12, opacity: 0.8 }}>{state.message}</span>
        </div>
      )}

      {["success", "already_scanned", "invalid", "error", "camera_error"].includes(state.status) && (
        <button onClick={scanNext} className="btn btn--block">
          Scan next pass
        </button>
      )}
    </div>
  );
}
