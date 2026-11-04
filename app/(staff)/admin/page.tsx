import AdminSearch from "@/components/AdminSearch";
import PageHeader from "@/components/PageHeader";

export default function AdminPage() {
  return (
    <>
      <PageHeader eyebrow="Registrations" title="Search & edit">
        Find a visitor or stall by name, child, email or phone. Edit details, reprint the pass or delete it.
      </PageHeader>
      <AdminSearch />
    </>
  );
}
