import type { Metadata } from "next";
import EntryForm from "@/components/EntryForm";
import PageHeader from "@/components/PageHeader";
import PublicBar from "@/components/PublicBar";
import Snowfall from "@/components/Snowfall";
import { EVENT } from "@/utils/event";

export const metadata: Metadata = {
  title: `Register · ${EVENT.name} ${EVENT.editionShort}`,
  description: `Register as a visitor or book a stall for ${EVENT.name} ${EVENT.edition}, ${EVENT.dateShort} at ${EVENT.venue}, ${EVENT.city}.`,
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).type;
  const type = Array.isArray(raw) ? raw[0] : raw;
  const initialKind = type === "stall" ? "stall" : "guest";

  return (
    <div className="app">
      <Snowfall />
      <PublicBar />
      <main className="app__main">
        <PageHeader eyebrow={`${EVENT.edition} · ${EVENT.dateShort}, ${EVENT.hours}`} title="Register for Season 02">
          {EVENT.venue}, {EVENT.city} · Ages {EVENT.ages}. Visitors get a QR pass right away. Running a stall? Share your details and we&apos;ll be in touch.
        </PageHeader>

        {EVENT.registrationOpen ? (
          <EntryForm variant="guest" initialKind={initialKind} />
        ) : (
          <div className="acard acard--top">
            <h2 style={{ fontFamily: "var(--f-head)", fontSize: 28, fontWeight: 400 }}>{EVENT.closedTitle}</h2>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>{EVENT.closedNote}</p>
          </div>
        )}
      </main>
      <p className="app__foot">
        By {EVENT.presenter} · <a href="/littlepreneurs/login">Staff login</a>
      </p>
    </div>
  );
}
