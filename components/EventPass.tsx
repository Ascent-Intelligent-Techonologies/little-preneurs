"use client";

import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { useState } from "react";
import { EVENT } from "@/utils/event";
import { KIND_LABEL, childrenLabel, displayTitle, formatPhone, type Entry } from "@/utils/entry";

type PassEntry = Pick<
  Entry,
  "id" | "kind" | "name" | "number" | "stall_name" | "category" | "child_name" | "child_age" | "child2_name" | "child2_age"
>;

// Mirrors the tokens in globals.css — canvas can't read CSS variables from classes.
const C = {
  ink: "#17303A",
  cream: "#F7F3EB",
  paper: "#FFFDF8",
  red: "#F2494A",
  yellow: "#FFD25A",
  muted: "#5D6F77",
  line: "#E4DDD0",
  mist: "#9DB3BD",
};

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
  return `${out.trimEnd()}…`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  // A missing logo shouldn't cost the guest their pass.
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
  });
}

// Draws the pass as a 1080×1560 PNG in the Littlepreneurs style, so it can
// be kept in a camera roll or printed.
async function renderPass(entry: PassEntry): Promise<HTMLCanvasElement> {
  const css = getComputedStyle(document.documentElement);
  const head = css.getPropertyValue("--font-outfit").trim() || "Georgia, serif";
  const body = css.getPropertyValue("--font-dm-sans").trim() || "system-ui, sans-serif";
  const mono = css.getPropertyValue("--font-space-grotesk").trim() || "ui-monospace, monospace";
  await Promise.all([
    document.fonts.load(`400 40px ${head}`),
    document.fonts.load(`400 30px ${body}`),
    document.fonts.load(`500 24px ${mono}`),
  ]).catch(() => undefined);

  const W = 1080;
  const H = 1560;
  const PAD = 90;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const track = (px: number) => {
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
  };

  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, W, H);

  // Logo (its artwork sits on the same cream)
  const logo = await loadImage("/assets/img/logo.webp");
  const lw = 520;
  const lh = lw / 3;
  if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, PAD - 26, 40, lw, lh);

  // Type pill, top right
  const label = KIND_LABEL[entry.kind].toUpperCase();
  ctx.font = `500 26px ${mono}`;
  track(5);
  const pw = ctx.measureText(label).width + 64;
  const px = W - PAD - pw;
  ctx.fillStyle = entry.kind === "stall" ? C.yellow : C.ink;
  ctx.beginPath();
  ctx.roundRect(px, 96, pw, 58, 29);
  ctx.fill();
  ctx.fillStyle = entry.kind === "stall" ? C.ink : "#fff";
  ctx.textBaseline = "middle";
  ctx.fillText(label, px + 32, 126);
  track(0);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = C.muted;
  ctx.font = `500 24px ${mono}`;
  track(5);
  ctx.fillText(`${EVENT.edition.toUpperCase()}`, PAD, 270);
  track(0);

  // QR on a white panel
  const panelY = 320;
  const panelH = 640;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(PAD, panelY, W - PAD * 2, panelH, 36);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.stroke();
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, entry.id, {
    width: 520,
    margin: 0,
    errorCorrectionLevel: "H",
    color: { dark: C.ink, light: "#ffffff" },
  });
  ctx.drawImage(qr, (W - 520) / 2, panelY + (panelH - 520) / 2, 520, 520);

  // Headline: stall/brand name for stalls, person's name for visitors
  const maxW = W - PAD * 2;
  const title = displayTitle(entry);
  ctx.fillStyle = C.ink;
  let size = 76;
  ctx.font = `400 ${size}px ${head}`;
  while (size > 46 && ctx.measureText(title).width > maxW) {
    size -= 4;
    ctx.font = `400 ${size}px ${head}`;
  }
  let y = panelY + panelH + 110;
  ctx.fillText(fitText(ctx, title, maxW), PAD, y);

  ctx.fillStyle = C.muted;
  ctx.font = `400 34px ${body}`;
  if (entry.kind === "stall") {
    y += 56;
    ctx.fillText(fitText(ctx, childrenLabel(entry), maxW), PAD, y);
    if (entry.category) {
      y += 50;
      ctx.fillText(fitText(ctx, entry.category, maxW), PAD, y);
    }
    y += 50;
    ctx.fillText(fitText(ctx, `Parent / guardian: ${entry.name}`, maxW), PAD, y);
  } else {
    y += 52;
    ctx.fillStyle = C.red;
    ctx.font = `500 26px ${mono}`;
    track(4);
    ctx.fillText(formatPhone(entry.number), PAD, y);
    track(0);
  }

  // Footer band
  const bandH = 210;
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, H - bandH, W, bandH);
  ctx.fillStyle = "#fff";
  ctx.font = `400 50px ${head}`;
  ctx.fillText(`${EVENT.dateShort} · ${EVENT.hours}`, PAD, H - bandH + 88);
  ctx.fillStyle = C.mist;
  ctx.font = `400 32px ${body}`;
  ctx.fillText(`${EVENT.venue}, ${EVENT.city}`, PAD, H - bandH + 142);
  ctx.fillStyle = C.yellow;
  ctx.font = `500 22px ${mono}`;
  track(4);
  const hand = EVENT.instagram.toUpperCase();
  ctx.fillText(hand, W - PAD - ctx.measureText(hand).width, H - bandH + 142);
  track(0);

  return canvas;
}

export default function EventPass({ entry }: { entry: PassEntry }) {
  const [busy, setBusy] = useState<"save" | "print" | null>(null);
  const title = displayTitle(entry);
  const fileName = `${EVENT.name}-pass-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  const handleSave = async () => {
    setBusy("save");
    try {
      const canvas = await renderPass(entry);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      // On phones, the share sheet is the way to "Save to Photos".
      const file = new File([blob], fileName, { type: "image/png" });
      if (window.matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `${EVENT.name} pass` });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          // Share not allowed here — fall through to a plain download.
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = async () => {
    // Open synchronously so popup blockers see the click.
    const win = window.open("", "_blank");
    if (!win) return;
    setBusy("print");
    try {
      const canvas = await renderPass(entry);
      win.document.write(
        `<html><head><title>${EVENT.name} pass</title><style>@page{margin:12mm}body{margin:0;text-align:center}img{max-width:100%;max-height:96vh}</style></head>` +
          `<body><img src="${canvas.toDataURL("image/png")}" onload="window.focus();window.print()" /></body></html>`
      );
      win.document.close();
    } finally {
      setBusy(null);
    }
  };

  const kids = childrenLabel(entry);

  return (
    <div className="stack-sm">
      <div className="pass">
        <div className="pass__top">
          <img src="/assets/img/logo.webp" alt="LittlePreneurs" width={132} height={44} />
          <span className={`badge ${entry.kind === "stall" ? "badge--stall" : ""}`}>{KIND_LABEL[entry.kind]}</span>
        </div>
        <p className="eyebrow pass__edition">{EVENT.edition}</p>

        <div className="pass__qr">
          <QRCodeSVG value={entry.id} size={200} level="H" bgColor="#ffffff" fgColor={C.ink} title={`Entry QR code for ${title}`} />
        </div>

        <div className="pass__body">
          <p className="pass__title">{title}</p>
          {entry.kind === "stall" ? (
            <>
              {kids && <p className="pass__sub">{kids}</p>}
              {entry.category && <p className="pass__sub">{entry.category}</p>}
              <p className="pass__sub">Parent / guardian: {entry.name}</p>
            </>
          ) : (
            <p className="pass__phone">{formatPhone(entry.number)}</p>
          )}
        </div>

        <div className="pass__foot">
          <strong>
            {EVENT.dateShort} · {EVENT.hours}
          </strong>
          <span>
            {EVENT.venue}, {EVENT.city}
          </span>
        </div>
      </div>

      <div className="btns2">
        <button type="button" onClick={handleSave} disabled={busy !== null} className="btn">
          {busy === "save" ? "Preparing…" : "Save pass"}
        </button>
        <button type="button" onClick={handlePrint} disabled={busy !== null} className="btn btn--ghost">
          {busy === "print" ? "Preparing…" : "Print"}
        </button>
      </div>
    </div>
  );
}
