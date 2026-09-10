import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      // Default is 1MB, far too small for real product photos.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
