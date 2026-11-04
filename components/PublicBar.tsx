import Link from "next/link";

export default function PublicBar({ label }: { label?: string }) {
  return (
    <div className="app__bar">
      <div className="app__bar-in">
        <Link href="/" className="app__brand" aria-label="Littlepreneurs home">
          <img src="/assets/img/logo.webp" alt="LittlePreneurs" width={102} height={34} />
          {label && <span className="eyebrow">{label}</span>}
        </Link>
        <Link href="/" className="app__logout">← Back to site</Link>
      </div>
    </div>
  );
}
