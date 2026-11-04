"use client";

import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";

const QRScanner = dynamic(() => import("@/components/QRScanner"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "64px 0" }}>
      <div className="spinner" />
    </div>
  ),
});

export default function VerifyPage() {
  return (
    <>
      <PageHeader eyebrow="At the door" title="Scan passes">
        Each pass works once. You&apos;ll see Success, or Already scanned if it&apos;s been used.
      </PageHeader>
      <QRScanner />
    </>
  );
}
