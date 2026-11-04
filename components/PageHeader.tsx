export default function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="ph">
      <p className="eyebrow eyebrow--red">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
