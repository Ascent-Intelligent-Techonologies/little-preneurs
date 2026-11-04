"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicBar from "@/components/PublicBar";

function LoginForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("next") || "/verify";
  // Only follow same-site paths.
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/verify";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Invalid passcode");
      } else {
        router.push(next);
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stack">
      <div>
        <label htmlFor="passcode" className="field-label">Staff passcode</label>
        <input id="passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} required autoFocus placeholder="Enter passcode" className="field" />
      </div>
      {error && <div className="alert-error">{error}</div>}
      <button type="submit" disabled={loading} className="btn btn--block">
        {loading ? "Verifying…" : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="app">
      <PublicBar label="Staff" />
      <main className="app__main" style={{ maxWidth: 420 }}>
        <div className="ph">
          <p className="eyebrow eyebrow--red">Staff access</p>
          <h1>Admin login</h1>
          <p>Scan passes, search and manage registrations.</p>
        </div>
        <div className="acard acard--top">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
