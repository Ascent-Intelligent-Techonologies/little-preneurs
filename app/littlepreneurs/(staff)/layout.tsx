import StaffHeader from "@/components/StaffHeader";

// Shared chrome for the admin-gated pages (/verify, /onboard, /admin, /guests).
// The public /register page and /login sit outside this group.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <StaffHeader />
      <main className="app__main">{children}</main>
    </div>
  );
}
