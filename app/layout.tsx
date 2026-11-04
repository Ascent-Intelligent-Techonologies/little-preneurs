import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-outfit", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"
  ),
  title: "Littlepreneurs Season 02 · Christmas Special",
  description: "A marketplace run by kids. 20 December, T-Works, Hyderabad.",
  icons: { icon: "/assets/img/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#17303A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
