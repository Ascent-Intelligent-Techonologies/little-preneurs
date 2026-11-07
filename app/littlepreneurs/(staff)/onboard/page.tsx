"use client";

import { useState } from "react";
import EntryForm from "@/components/EntryForm";
import ExcelUpload from "@/components/ExcelUpload";
import PageHeader from "@/components/PageHeader";

type Tab = "individual" | "bulk";

export default function OnboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("individual");

  return (
    <>
      <PageHeader eyebrow="Registrations" title="Register guests">
        Add a walk-in visitor or a stall, or import a spreadsheet.
      </PageHeader>

      <div className="tabsrow" role="tablist">
        {(["individual", "bulk"] as Tab[]).map((tab) => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab === "individual" ? "One registration" : "Bulk upload"}
          </button>
        ))}
      </div>

      <div className="acard">{activeTab === "individual" ? <EntryForm /> : <ExcelUpload />}</div>
    </>
  );
}
