// Shared registration shape + validation, used by the API routes and the
// client components alike.
import { EVENT } from "./event";

export const DEFAULT_COUNTRY_CODE = "+91";

// guest = a visitor; stall = a child's (or two children's) stall / brand.
export type EntryKind = "guest" | "stall";
export type TableType = "single" | "shared";

export interface Entry {
  id: string;
  kind: EntryKind;
  // Visitor's name, or the parent / guardian's name for a stall.
  name: string;
  email: string;
  number: string;
  // Stall-only fields (null for visitors)
  stall_name: string | null;
  category: string | null;
  table_type: TableType | null;
  child_name: string | null;
  child_age: number | null;
  child2_name: string | null;
  child2_age: number | null;
  checkedin: boolean;
  checked_in_at: string | null;
  created_at: string;
}

export type EntryInput = Partial<Omit<Entry, "id" | "checkedin" | "checked_in_at" | "created_at">>;

// Canonicalise to E.164 so "98765 43210", "+91 98765-43210" and
// "919876543210" all hit the same unique index. Numbers without a
// country code are treated as Indian.
export function normalizePhone(raw: unknown): string | null {
  const str = String(raw ?? "").trim();
  const hasPlus = str.startsWith("+");
  const digits = str.replace(/\D/g, "");

  if (!hasPlus) {
    if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
    if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
    if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
    return null;
  }
  if (digits.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : null;
  }
  return /^\d{8,15}$/.test(digits) ? `+${digits}` : null;
}

export function formatPhone(number: string): string {
  const m = number.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : number;
}

// Indian numbers without the country code ("98765 43210"). Anything else
// keeps its +code, since the number is ambiguous without it.
export function localPhone(number: string): string {
  const m = number.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `${m[1]} ${m[2]}` : number;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

export const KIND_LABEL: Record<EntryKind, string> = { guest: "Visitor", stall: "Stall" };

// The line shown as the headline of a pass / scan result.
export function displayTitle(e: Pick<Entry, "kind" | "name" | "stall_name">): string {
  return e.kind === "stall" && e.stall_name ? e.stall_name : e.name;
}

// "Aarav (9)" or "Aarav (9) & Diya (11)"
export function childrenLabel(e: Pick<Entry, "child_name" | "child_age" | "child2_name" | "child2_age">): string {
  const one = (n: string | null, a: number | null) => (n ? `${n}${a != null ? ` (${a})` : ""}` : "");
  return [one(e.child_name, e.child_age), one(e.child2_name, e.child2_age)].filter(Boolean).join(" & ");
}

const clean = (v: unknown) => String(v ?? "").trim().replace(/\s+/g, " ");

function cleanAge(v: unknown, label: string): number | string {
  const n = Number(String(v ?? "").trim());
  if (!Number.isInteger(n)) return `Enter ${label} as a whole number`;
  if (n < EVENT.minAge || n > EVENT.maxAge) return `${label[0].toUpperCase()}${label.slice(1)} must be between ${EVENT.minAge} and ${EVENT.maxAge}`;
  return n;
}

// Validates a full registration (create) or, with `partial`, only the
// fields present in the body (admin edit). Returns an error string on
// failure.
export function cleanEntryInput(
  body: Record<string, unknown>,
  { partial = false }: { partial?: boolean } = {}
): EntryInput | string {
  const out: EntryInput = {};
  const kind: EntryKind = body.kind === "stall" ? "stall" : "guest";
  if (!partial) out.kind = kind;
  const isStall = partial ? true : kind === "stall";

  if (!partial || "name" in body) {
    const name = clean(body.name);
    if (!name) return isStall ? "Please enter the parent / guardian's name" : "Please enter your name";
    if (name.length > 120) return "Name is too long";
    out.name = name;
  }

  if (!partial || "email" in body) {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) return "Please enter your email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    out.email = email;
  }

  if (!partial || "number" in body) {
    if (!String(body.number ?? "").replace(/^\+\d{1,3}\s*$/, "").trim()) {
      return "Please enter your phone number";
    }
    const number = normalizePhone(body.number);
    if (!number) return "Enter a valid phone number, e.g. +91 98765 43210";
    out.number = number;
  }

  if (!isStall) return out;

  // ---- stall fields ----
  if (!partial || "stall_name" in body) {
    const v = clean(body.stall_name);
    if (!v) return "Please enter the stall / brand name";
    if (v.length > 120) return "Stall name is too long";
    out.stall_name = v;
  }

  if (!partial || "category" in body) {
    const v = clean(body.category);
    if (!v) return "Please choose a category";
    if (v.length > 80) return "Category is too long";
    out.category = v;
  }

  if (!partial || "table_type" in body) {
    if (body.table_type !== "single" && body.table_type !== "shared") return "Choose 1 child or 2 children sharing a table";
    out.table_type = body.table_type;
  }

  if (!partial || "child_name" in body) {
    const v = clean(body.child_name);
    if (!v) return "Please enter the child's name";
    if (v.length > 120) return "Child's name is too long";
    out.child_name = v;
  }

  if (!partial || "child_age" in body) {
    const age = cleanAge(body.child_age, "the child's age");
    if (typeof age === "string") return age;
    out.child_age = age;
  }

  // Second child only for a shared table; a single table clears it.
  const tableType = out.table_type ?? (body.table_type as string | undefined);
  if (tableType === "single") {
    out.child2_name = null;
    out.child2_age = null;
  } else if (tableType === "shared" || (partial && ("child2_name" in body || "child2_age" in body))) {
    const n2 = clean(body.child2_name);
    if (!n2) return "Please enter the second child's name";
    if (n2.length > 120) return "Child's name is too long";
    const a2 = cleanAge(body.child2_age, "the second child's age");
    if (typeof a2 === "string") return a2;
    out.child2_name = n2;
    out.child2_age = a2;
  }

  return out;
}
