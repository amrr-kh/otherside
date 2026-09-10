import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
