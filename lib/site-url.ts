const PRODUCTION_URL = "https://otherside-store.com";

/** Canonical origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_URL
    : "http://localhost:3000";
}
