import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { KIND_LABEL, childrenLabel, displayTitle, formatPhone, type Entry, type EntryKind } from "@/utils/entry";

const PAGE_SIZE = 20;

function istDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function istClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

const FILTERS: { value: "" | EntryKind; label: string }[] = [
  { value: "", label: "All" },
  { value: "guest", label: "Visitors" },
  { value: "stall", label: "Stalls" },
];

const href = (kind: string, page: number) => {
  const p = new URLSearchParams();
  if (kind) p.set("kind", kind);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return `/guests${s ? `?${s}` : ""}`;
};

function PageLink({ to, disabled, children }: { to: string; disabled: boolean; children: React.ReactNode }) {
  return disabled ? <span className="pg">{children}</span> : <Link href={to}>{children}</Link>;
}

// Reading searchParams makes this render per request, so the list is
// always current.
export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const requested = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);
  const kindParam = first(sp.kind);
  const kind: "" | EntryKind = kindParam === "guest" || kindParam === "stall" ? kindParam : "";

  const supabase = createClient();
  const count = (k?: EntryKind, checkedIn?: boolean) => {
    let q = supabase.from("entries").select("*", { count: "exact", head: true });
    if (k) q = q.eq("kind", k);
    if (checkedIn) q = q.eq("checkedin", true);
    return q;
  };
  const [totalRes, checkedInRes, guestRes, stallRes] = await Promise.all([
    count(kind || undefined),
    count(kind || undefined, true),
    count("guest"),
    count("stall"),
  ]);

  const total = totalRes.count ?? 0;
  const checkedIn = checkedInRes.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, pages);
  const from = (page - 1) * PAGE_SIZE;

  let listQuery = supabase.from("entries").select().order("created_at", { ascending: false });
  if (kind) listQuery = listQuery.eq("kind", kind);
  const { data, error } = await listQuery.range(from, from + PAGE_SIZE - 1);

  const entries = (data ?? []) as Entry[];
  const loadError = totalRes.error ?? checkedInRes.error ?? error;
  const counts: Record<string, number> = { "": (guestRes.count ?? 0) + (stallRes.count ?? 0), guest: guestRes.count ?? 0, stall: stallRes.count ?? 0 };
  const csvHref = `/api/entries/export${kind ? `?kind=${kind}` : ""}`;

  return (
    <>
      <PageHeader eyebrow="Guest list" title="All registrations">
        {total} registered · {checkedIn} checked in
      </PageHeader>

      <div className="filters">
        {FILTERS.map((f) => (
          <Link key={f.value} href={href(f.value, 1)} aria-current={kind === f.value ? "page" : undefined}>
            {f.label} ({counts[f.value]})
          </Link>
        ))}
      </div>

      <a href={csvHref} download className="btn btn--ghost btn--block" style={{ marginBottom: 20 }}>
        Download CSV{kind ? ` · ${KIND_LABEL[kind].toLowerCase()}s` : ""}
      </a>

      {loadError && <div className="alert-error" style={{ marginBottom: 16 }}>{loadError.message}</div>}

      {!loadError && entries.length === 0 ? (
        <div className="list"><p className="empty">No registrations yet.</p></div>
      ) : (
        <ol className="list">
          {entries.map((entry, i) => (
            <li key={entry.id} className="item" style={{ cursor: "default" }}>
              <span style={{ width: 26, flex: "none", textAlign: "right", fontSize: 12, color: "#8a98a0", paddingTop: 3 }}>{from + i + 1}</span>
              <div className="item__main">
                <span className="item__title">{displayTitle(entry)}</span>
                <span className="item__sub">
                  {entry.kind === "stall" ? `${childrenLabel(entry)} · ` : ""}
                  {formatPhone(entry.number)} · {entry.email}
                </span>
                <span className="item__meta">
                  Registered {istDateTime(entry.created_at)}
                  {entry.kind === "stall" && entry.category ? ` · ${entry.category}` : ""}
                </span>
              </div>
              <div className="item__side">
                <span className={`badge ${entry.kind === "stall" ? "badge--stall" : ""}`}>{KIND_LABEL[entry.kind]}</span>
                <span className={`statusline ${entry.checkedin ? "scan-yes" : "scan-no"}`}>
                  {entry.checkedin ? `Scanned${entry.checked_in_at ? ` ${istClock(entry.checked_in_at)}` : ""}` : "Not scanned"}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}

      {total > PAGE_SIZE && (
        <nav className="pager" aria-label="Pagination">
          <PageLink to={href(kind, page - 1)} disabled={page <= 1}>‹ Previous</PageLink>
          <p>
            Page {page} of {pages}
            <br />
            {from + 1}–{from + entries.length} of {total}
          </p>
          <PageLink to={href(kind, page + 1)} disabled={page >= pages}>Next ›</PageLink>
        </nav>
      )}
    </>
  );
}
