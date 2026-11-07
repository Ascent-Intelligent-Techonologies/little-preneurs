import { type NextRequest, NextResponse } from "next/server";
import { EVENT } from "@/utils/event";

async function expectedToken(): Promise<string | null> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("lp_admin_v1"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// The Littlepreneurs staff tools (/littlepreneurs/verify, /onboard, /admin,
// /guests) and the API are admin-gated. Public: the Littlepreneurs landing
// page, its registration page, login itself, and — while the guest list is
// open — the create endpoint the public form posts to. The Late Checkout
// site at / is static and never gated.
const LP = "/littlepreneurs";
const PUBLIC_PAGES = new Set(["/", LP, `${LP}/register`, `${LP}/login`]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (PUBLIC_PAGES.has(normalised)) {
    return NextResponse.next();
  }
  // Only the staff tools and the API are gated; anything else is just a 404.
  if (!pathname.startsWith(`${LP}/`) && !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  // Public sign-ups only while the guest list is open. Staff keep creating
  // walk-ins from /onboard, which carries the session cookie and falls
  // through to the check below.
  if (pathname === "/api/entries" && request.method === "POST" && EVENT.registrationOpen) {
    return NextResponse.next();
  }

  const token = request.cookies.get("lp_admin_session")?.value;
  const expected = await expectedToken();

  if (!expected || token !== expected) {
    // API routes get a 401, pages get redirected to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL(`${LP}/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match every route except static assets (anything with a file
  // extension) and Next.js internals — everything else goes through
  // the allow/deny logic above.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
