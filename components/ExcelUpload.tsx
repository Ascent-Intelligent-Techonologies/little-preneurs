"use client";

import { useState, useRef, DragEvent } from "react";
import * as XLSX from "xlsx";
import type { EntryKind } from "@/utils/entry";

type Row = Record<string, string>;

interface UploadResult {
  success: number;
  errors: { row: number; name: string; error: string }[];
}

// Spreadsheet column → API field, per registration type.
const COLUMNS: Record<EntryKind, { field: string; label: string; required: boolean; aliases?: string[] }[]> = {
  guest: [
    { field: "name", label: "name", required: true },
    { field: "email", label: "email", required: true },
    { field: "number", label: "number", required: true, aliases: ["phone", "mobile"] },
  ],
  stall: [
    { field: "stall_name", label: "stall_name", required: true, aliases: ["stall", "brand", "brand_name"] },
    { field: "category", label: "category", required: true },
    { field: "table_type", label: "table", required: true, aliases: ["table_type"] },
    { field: "child_name", label: "child_name", required: true, aliases: ["child", "child_1", "child_1_name"] },
    { field: "child_age", label: "child_age", required: true, aliases: ["age", "child_1_age"] },
    { field: "child2_name", label: "child2_name", required: false, aliases: ["child_2", "child_2_name"] },
    { field: "child2_age", label: "child2_age", required: false, aliases: ["child_2_age"] },
    { field: "name", label: "name", required: true, aliases: ["parent", "parent_name", "guardian"] },
    { field: "email", label: "email", required: true },
    { field: "number", label: "number", required: true, aliases: ["phone", "mobile"] },
  ],
};

const norm = (s: string) => s.toLowerCase().trim().replace(/[\s-]+/g, "_");

const Code = ({ children }: { children: React.ReactNode }) => <code className="code">{children}</code>;

export default function ExcelUpload() {
  const [kind, setKind] = useState<EntryKind>("guest");
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cols = COLUMNS[kind];

  const clear = () => {
    setRows([]);
    setFileName(null);
    setResult(null);
    setParseError(null);
  };

  const parseFile = (file: File, forKind: EntryKind = kind) => {
    setParseError(null);
    setResult(null);
    setRows([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

        if (raw.length === 0) {
          setParseError("The spreadsheet appears to be empty.");
          return;
        }

        const defs = COLUMNS[forKind];
        const parsed: Row[] = raw.map((r) => {
          const out: Row = {};
          for (const def of defs) {
            const keys = [def.label, def.field, ...(def.aliases ?? [])].map(norm);
            const hit = Object.entries(r).find(([k]) => keys.includes(norm(k)));
            const v = String(hit?.[1] ?? "").trim();
            if (v) out[def.field] = v;
          }
          // Table column: anything mentioning "shared" / 2 means a shared table.
          if (forKind === "stall") {
            out.table_type = /shared|2|two/i.test(out.table_type ?? "") ? "shared" : "single";
          }
          return out;
        });

        const required = defs.filter((d) => d.required && d.field !== "table_type").map((d) => d.field);
        const valid = parsed.filter((r) => required.every((f) => r[f]));
        if (valid.length === 0) {
          setParseError(`No valid rows found. Each row needs: ${defs.filter((d) => d.required).map((d) => d.label).join(", ")}.`);
          return;
        }

        setRows(valid);
      } catch {
        setParseError("Could not parse the file. Make sure it is a valid .xlsx, .xls, or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleSubmit = async () => {
    setUploading(true);
    const errors: UploadResult["errors"] = [];
    let success = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const label = row.stall_name || row.name || `Row ${i + 1}`;
      try {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...row, kind }),
        });
        if (res.ok) {
          success++;
        } else {
          const d = await res.json();
          errors.push({ row: i + 1, name: label, error: d.error || "Failed" });
        }
      } catch {
        errors.push({ row: i + 1, name: label, error: "Network error" });
      }
    }

    setResult({ success, errors });
    setRows([]);
    setFileName(null);
    setUploading(false);
  };

  if (result) {
    return (
      <div className="stack">
        <div className={result.errors.length === 0 ? "alert-ok" : "alert-error"}>
          <p style={{ fontWeight: 700 }}>
            {result.success} registration{result.success === 1 ? "" : "s"} imported
            {result.errors.length > 0 && `, ${result.errors.length} failed`}
          </p>
          {result.errors.length > 0 && (
            <ul style={{ marginTop: 8, paddingLeft: 18, listStyle: "disc" }}>
              {result.errors.map((e) => (
                <li key={e.row}>
                  Row {e.row} ({e.name}): {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={clear} className="btn btn--ghost btn--block">
          Upload another file
        </button>
      </div>
    );
  }

  const preview = cols.filter((c) => ["name", "stall_name", "child_name", "email", "number"].includes(c.field));

  return (
    <div className="stack">
      <div className="seg seg--sm" role="group" aria-label="Import type">
        <button type="button" aria-pressed={kind === "guest"} onClick={() => { setKind("guest"); clear(); }}>
          Visitors
        </button>
        <button type="button" aria-pressed={kind === "stall"} onClick={() => { setKind("stall"); clear(); }}>
          Stalls / brands
        </button>
      </div>

      <div
        className="drop"
        data-drag={dragging}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) parseFile(f);
            e.target.value = "";
          }}
        />
        <strong>{fileName ?? "Drop a spreadsheet here"}</strong>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>or click to browse · .xlsx, .xls, .csv</p>
        <p style={{ marginTop: 14, fontSize: 13, color: "var(--muted)", lineHeight: 1.9 }}>
          Columns:{" "}
          {cols.map((c, i) => (
            <span key={c.field}>
              <Code>{c.label}</Code>
              {c.required ? "" : " (optional)"}
              {i < cols.length - 1 ? " " : ""}
            </span>
          ))}
          <br />
          Numbers without a country code are treated as +91.{" "}
          <a href={kind === "guest" ? "/sample_visitors.csv" : "/sample_stalls.csv"} download style={{ textDecoration: "underline" }} onClick={(e) => e.stopPropagation()}>
            Download a sample
          </a>
        </p>
      </div>

      {parseError && <div className="alert-error">{parseError}</div>}

      {rows.length > 0 && (
        <div className="stack">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontWeight: 500 }}>{rows.length} rows ready to import</p>
            <button onClick={clear} className="linkbtn">
              Clear
            </button>
          </div>
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {preview.map((c) => (
                    <th key={c.field}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    {preview.map((c) => (
                      <td key={c.field}>{r[c.field]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSubmit} disabled={uploading} className="btn btn--block">
            {uploading ? `Importing ${rows.length} registrations…` : `Import ${rows.length} registrations`}
          </button>
        </div>
      )}
    </div>
  );
}
