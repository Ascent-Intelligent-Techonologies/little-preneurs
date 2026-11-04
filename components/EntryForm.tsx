"use client";

import { useEffect, useRef, useState } from "react";
import EventPass from "./EventPass";
import WelcomeNote from "./WelcomeNote";
import { DEFAULT_COUNTRY_CODE, type Entry, type EntryKind, type TableType } from "@/utils/entry";
import { EVENT } from "@/utils/event";

// `guest` is the public /register flow (welcome note after submit);
// `staff` is the /onboard flow (register-another loop).
export default function EntryForm({
  variant = "staff",
  initialKind = "guest",
}: {
  variant?: "guest" | "staff";
  initialKind?: EntryKind;
}) {
  const [kind, setKind] = useState<EntryKind>(initialKind);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [number, setNumber] = useState("");
  // stall
  const [stallName, setStallName] = useState("");
  const [category, setCategory] = useState("");
  const [tableType, setTableType] = useState<TableType>("single");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [child2Name, setChild2Name] = useState("");
  const [child2Age, setChild2Age] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Entry | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const isGuestFlow = variant === "guest";
  const isStall = kind === "stall";

  useEffect(() => {
    if (created) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [created]);

  const reset = () => {
    setName("");
    setEmail("");
    setCountryCode(DEFAULT_COUNTRY_CODE);
    setNumber("");
    setStallName("");
    setCategory("");
    setTableType("single");
    setChildName("");
    setChildAge("");
    setChild2Name("");
    setChild2Age("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // A number pasted with its own "+code" wins over the code box.
    const local = number.trim();
    const fullNumber = local.startsWith("+") ? local : `${countryCode}${local.replace(/^0+/, "")}`;

    const payload = isStall
      ? {
          kind,
          name,
          email,
          number: fullNumber,
          stall_name: stallName,
          category,
          table_type: tableType,
          child_name: childName,
          child_age: childAge,
          child2_name: tableType === "shared" ? child2Name : undefined,
          child2_age: tableType === "shared" ? child2Age : undefined,
        }
      : { kind, name, email, number: fullNumber };

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setCreated(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div ref={topRef} className="stack" style={{ scrollMarginTop: 24 }}>
        {isGuestFlow ? (
          <WelcomeNote entry={created} />
        ) : (
          <div className="alert-ok">
            Registered <strong>{created.stall_name || created.name}</strong>. Hand over or print the pass below.
          </div>
        )}
        <EventPass entry={created} />
        <button type="button" onClick={() => setCreated(null)} className={isGuestFlow ? "linkbtn" : "btn btn--ghost btn--block"}>
          {isGuestFlow ? "Register someone else" : "Register another"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`stack ${isGuestFlow ? "acard acard--top" : ""}`}>
      <div className="seg" role="group" aria-label="Registration type">
        <button type="button" aria-pressed={!isStall} onClick={() => setKind("guest")}>
          Visitor
        </button>
        <button type="button" aria-pressed={isStall} onClick={() => setKind("stall")}>
          Stall / brand
        </button>
      </div>

      <p className="field-hint" style={{ marginTop: 12 }}>
        {isStall ? EVENT.stallInvite : EVENT.guestInvite} {isStall ? "" : "Share your details and get your QR pass."}
      </p>

      {error && <div className="alert-error">{error}</div>}

      {isStall && (
        <>
          <div>
            <label htmlFor="stall-name" className="field-label">Stall / brand name</label>
            <input id="stall-name" className="field" value={stallName} onChange={(e) => setStallName(e.target.value)} required placeholder="e.g. Stories by Rana" />
          </div>

          <div>
            <label htmlFor="category" className="field-label">Category</label>
            <select id="category" className="field" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Choose a category</option>
              {EVENT.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <fieldset className="stack-sm" style={{ border: 0 }}>
            <legend className="field-label">Table</legend>
            <label className="opt" data-on={tableType === "single"}>
              <input type="radio" name="table" checked={tableType === "single"} onChange={() => setTableType("single")} />
              <div><strong>1 child / 1 table</strong><span>{EVENT.prices.single} per child, per table</span></div>
            </label>
            <label className="opt" data-on={tableType === "shared"}>
              <input type="radio" name="table" checked={tableType === "shared"} onChange={() => setTableType("shared")} />
              <div><strong>2 children / 1 shared table</strong><span>{EVENT.prices.shared} total · same category only</span></div>
            </label>
          </fieldset>

          <div className="row2">
            <div>
              <label htmlFor="child-name" className="field-label">{tableType === "shared" ? "Child 1 name" : "Child's name"}</label>
              <input id="child-name" className="field" value={childName} onChange={(e) => setChildName(e.target.value)} required placeholder="e.g. Rana" />
            </div>
            <div>
              <label htmlFor="child-age" className="field-label">Age</label>
              <input id="child-age" className="field" type="number" inputMode="numeric" min={EVENT.minAge} max={EVENT.maxAge} value={childAge} onChange={(e) => setChildAge(e.target.value)} required placeholder={`${EVENT.minAge}–${EVENT.maxAge}`} />
            </div>
          </div>

          {tableType === "shared" && (
            <div className="row2">
              <div>
                <label htmlFor="child2-name" className="field-label">Child 2 name</label>
                <input id="child2-name" className="field" value={child2Name} onChange={(e) => setChild2Name(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="child2-age" className="field-label">Age</label>
                <input id="child2-age" className="field" type="number" inputMode="numeric" min={EVENT.minAge} max={EVENT.maxAge} value={child2Age} onChange={(e) => setChild2Age(e.target.value)} required placeholder={`${EVENT.minAge}–${EVENT.maxAge}`} />
              </div>
            </div>
          )}

          <p className="field-hint subform" style={{ marginTop: 0 }}>
            Table fee: {EVENT.prices.single} for 1 child, or {EVENT.prices.shared} for 2 children sharing. Pay via the QR in the <a href="/#book" style={{ textDecoration: "underline" }}>booking section</a>.
          </p>
        </>
      )}

      <div>
        <label htmlFor="entry-name" className="field-label">{isStall ? "Parent / guardian name" : "Full name"}</label>
        <input id="entry-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="e.g. Ananya Rao" className="field" />
      </div>

      <div>
        <label htmlFor="entry-email" className="field-label">Email</label>
        <input id="entry-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="field" />
      </div>

      <div>
        <label htmlFor="entry-number" className="field-label">Phone number</label>
        <div className="phone">
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(`+${e.target.value.replace(/\D/g, "").slice(0, 3)}`)}
            aria-label="Country code"
            autoComplete="tel-country-code"
            inputMode="tel"
            className="field"
          />
          <input id="entry-number" type="tel" value={number} onChange={(e) => setNumber(e.target.value)} required autoComplete="tel-national" inputMode="tel" placeholder="98765 43210" className="field" />
        </div>
        {!isStall && <p className="field-hint">One visitor pass per phone number.</p>}
      </div>

      <button type="submit" disabled={loading} className="btn btn--block">
        {loading ? "Creating your pass…" : isGuestFlow ? "Get my pass" : "Register & generate pass"}
      </button>
    </form>
  );
}
