import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// Private/transactional areas exist in both languages (the default language
// has no URL prefix, Arabic lives under /ar).
const PRIVATE_PATHS = [
  "/cart",
  "/checkout",
  "/account",
  "/wishlist",
  "/order-confirmation/",
  "/track-order",
  "/search",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          ...PRIVATE_PATHS,
          ...PRIVATE_PATHS.map((path) => `/ar${path}`),
        ],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
