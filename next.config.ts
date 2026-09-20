import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Baseline browser hardening for every response. (A full Content-Security-Policy
// is deliberately not set here: it needs to be tuned against Google Analytics
// and Google sign-in first.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stops other sites from putting the store (checkout, admin) in an iframe.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  experimental: {
    serverActions: {
      // Default is 1MB, far too small for real product photos.
      bodySizeLimit: "20mb",
    },
    // Needed because /admin sits outside the [locale] root layout —
    // there's no single layout left to compose a generic not-found from.
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
