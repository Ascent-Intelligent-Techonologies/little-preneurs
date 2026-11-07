import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The Late Checkout site is plain static HTML in public/late-checkout.
      beforeFiles: [
        { source: "/", destination: "/late-checkout/index.html" },
        // Tolerate the common spelling slip in shared links.
        { source: "/littleprenerus", destination: "/littlepreneurs" },
      ],
    };
  },
  async redirects() {
    // Littlepreneurs used to live at the site root; keep old links working.
    return ["register", "login", "verify", "onboard", "admin", "guests"].map((p) => ({
      source: `/${p}`,
      destination: `/littlepreneurs/${p}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
