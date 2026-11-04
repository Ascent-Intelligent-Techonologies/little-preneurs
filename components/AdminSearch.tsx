"use client";

import { useState } from "react";
import EventPass from "./EventPass";
import { EVENT } from "@/utils/event";
import { KIND_LABEL, childrenLabel, displayTitle, formatPhone, type Entry, type EntryKind, type TableType } from "@/utils/entry";

const SEARCH_LIMIT = 50;

function checkedInLabel(entry: Entry): string {
  if (!entry.checkedin) return "Not scanned";
  if (!entry.checked_in_at) return "Scanned";
  const time = new Date(entry.checked_in_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  return `Scanned ${time}`;
}

export default function AdminSearch() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"" | EntryKind>("");
  const [results, setResults] = useState<Entry[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Entry | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [checkedin, setCheckedin] = useState(false);
  const [stallName, setStallName] = useState("");
  const [category, setCategory] = useState("");
  const [tableType, setTableType] = useState<TableType>("single");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [child2Name, setChild2Name] = useState("");
  const [child2Age, setChild2Age] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const runSearch = async (e?: React.FormEvent, kind: "" | EntryKind = kindFilter) => {
    e?.preventDefault();
    setSearching(true);
    setSearchError(null);
    setSelected(null);
    try {
      const params = new URLSearchParams({ q: query.trim() });
      if (kind) params.set("kind", kind);
      const res = await fetch(`/api/entries?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Unknown error");
      setResults(null);
    } finally {
      setSearching(false);
    }
  };

  const select = (entry: Entry) => {
    setSelected(entry);
    setName(entry.name);
    setEmail(entry.email);
    setNumber(formatPhone(entry.number));
    setCheckedin(entry.checkedin);
    setStallName(entry.stall_name ?? "");
    setCategory(entry.category ?? "");
    setTableType(entry.table_type ?? "single");
    setChildName(entry.child_name ?? "");
    setChildAge(entry.child_age?.toString() ?? "");
    setChild2Name(entry.child2_name ?? "");
    setChild2Age(entry.child2_age?.toString() ?? "");
    setSaveError(null);
    setSaveOk(false);
    setConfirmingDelete(false);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    const body =
      selected.kind === "stall"
        ? {
            name,
            email,
            number,
            checkedin,
            stall_name: stallName,
            category,
            table_type: tableType,
            child_name: childName,
            child_age: childAge,
            ...(tableType === "shared" ? { child2_name: child2Name, child2_age: child2Age } : {}),
          }
        : { name, email, number, checkedin };
    try {
      const res = await fetch(`/api/entries/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      select(data);
      setResults((prev) => prev?.map((e) => (e.id === data.id ? data : e)) ?? prev);
      setSaveOk(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${selected.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setResults((prev) => prev?.filter((e) => e.id !== selected.id) ?? prev);
      setSelected(null);
      setConfirmingDelete(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  };

  const isStall = selected?.kind === "stall";
  const categories: string[] = [...EVENT.categories];
  if (category && !categories.includes(category)) categories.unshift(category);

  return (
    <div className="stack">
      <form onSubmit={runSearch} className="searchbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, stall, child, email or phone"
          className="field"
        />
        <button type="submit" disabled={searching} className="btn">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      <div className="seg seg--sm" role="group" aria-label="Filter by type">
        {([["", "All"], ["guest", "Visitors"], ["stall", "Stalls"]] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={kindFilter === value}
            onClick={() => {
              setKindFilter(value);
              if (results) runSearch(undefined, value);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {searchError && <div className="alert-error">{searchError}</div>}

      {results && (
        <div className="stack-sm">
          <p className="eyebrow">
            {results.length === SEARCH_LIMIT
              ? `First ${SEARCH_LIMIT} matches — narrow your search`
              : `${results.length} match${results.length === 1 ? "" : "es"}`}
          </p>
          <div className="list">
            {results.map((entry) => (
              <button key={entry.id} onClick={() => select(entry)} className={`item ${selected?.id === entry.id ? "sel" : ""}`}>
                <span className="item__main">
                  <span className="item__title">{displayTitle(entry)}</span>
                  <span className="item__sub">
                    {entry.kind === "stall" ? `${childrenLabel(entry)} · ` : ""}
                    {formatPhone(entry.number)} · {entry.email}
                  </span>
                </span>
                <span className="item__side">
                  <span className={`badge ${entry.kind === "stall" ? "badge--stall" : ""}`}>{KIND_LABEL[entry.kind]}</span>
                  <span className={`statusline ${entry.checkedin ? "scan-yes" : "scan-no"}`}>
                    {entry.checkedin ? "Scanned" : "Not scanned"}
                  </span>
                </span>
              </button>
            ))}
            {results.length === 0 && <p className="empty">No matches</p>}
          </div>
        </div>
      )}

      {selected && (
        <div className="acard acard--top stack">
          <div>
            <h2 style={{ fontFamily: "var(--f-head)", fontSize: 26, fontWeight: 400 }}>
              Edit {isStall ? "stall" : "visitor"} registration
            </h2>
            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#8a98a0", wordBreak: "break-all", marginTop: 2 }}>
              {selected.id}
            </p>
          </div>

          {saveError && <div className="alert-error">{saveError}</div>}
          {saveOk && <div className="alert-ok">Saved.</div>}

          {isStall && (
            <>
              <div>
                <label htmlFor="edit-stall" className="field-label">Stall / brand name</label>
                <input id="edit-stall" className="field" value={stallName} onChange={(e) => setStallName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="edit-cat" className="field-label">Category</label>
                <select id="edit-cat" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-table" className="field-label">Table</label>
                <select id="edit-table" className="field" value={tableType} onChange={(e) => setTableType(e.target.value as TableType)}>
                  <option value="single">1 child / 1 table</option>
                  <option value="shared">2 children / 1 shared table</option>
                </select>
              </div>
              <div className="row2">
                <div>
                  <label htmlFor="edit-child" className="field-label">Child 1</label>
                  <input id="edit-child" className="field" value={childName} onChange={(e) => setChildName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="edit-child-age" className="field-label">Age</label>
                  <input id="edit-child-age" className="field" type="number" min={EVENT.minAge} max={EVENT.maxAge} value={childAge} onChange={(e) => setChildAge(e.target.value)} />
                </div>
              </div>
              {tableType === "shared" && (
                <div className="row2">
                  <div>
                    <label htmlFor="edit-child2" className="field-label">Child 2</label>
                    <input id="edit-child2" className="field" value={child2Name} onChange={(e) => setChild2Name(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="edit-child2-age" className="field-label">Age</label>
                    <input id="edit-child2-age" className="field" type="number" min={EVENT.minAge} max={EVENT.maxAge} value={child2Age} onChange={(e) => setChild2Age(e.target.value)} />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label htmlFor="edit-name" className="field-label">{isStall ? "Parent / guardian name" : "Full name"}</label>
            <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="edit-email" className="field-label">Email</label>
            <input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="edit-number" className="field-label">Phone number</label>
            <input id="edit-number" type="tel" value={number} onChange={(e) => setNumber(e.target.value)} className="field" />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
            <input type="checkbox" checked={checkedin} onChange={(e) => setCheckedin(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--ink)" }} />
            Pass scanned
            <span style={{ fontSize: 12, color: "var(--muted)" }}>({checkedInLabel(selected)})</span>
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} disabled={saving} className="btn" style={{ flex: 1 }}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            {!confirmingDelete ? (
              <button onClick={() => setConfirmingDelete(true)} className="dangerbtn">
                Delete
              </button>
            ) : (
              <>
                <button onClick={handleDelete} disabled={deleting} className="dangerbtn dangerbtn--solid">
                  {deleting ? "Deleting…" : "Confirm"}
                </button>
                <button onClick={() => setConfirmingDelete(false)} className="dangerbtn" style={{ color: "var(--muted)", borderColor: "var(--line)" }}>
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="subform">
            <p className="eyebrow" style={{ marginBottom: 12 }}>Pass</p>
            <EventPass entry={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
