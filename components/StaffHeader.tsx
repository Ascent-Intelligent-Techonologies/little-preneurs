"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/verify", label: "Scan" },
  { href: "/onboard", label: "Register" },
  { href: "/admin", label: "Search" },
  { href: "/guests", label: "Guests" },
];

export default function StaffHeader() {
  const pathname = usePathname();

  return (
    <header>
      <div className="app__bar">
        <div className="app__bar-in">
          <Link href="/verify" className="app__brand">
            <img src="/assets/img/logo.webp" alt="LittlePreneurs" width={102} height={34} />
            <span className="eyebrow">Staff</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
      <nav className="app__tabs" aria-label="Staff">
        <div className="app__tabs-in">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
