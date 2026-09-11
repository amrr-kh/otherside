import "server-only";

/**
 * Minimal structured logging for operational events (DB failures, retries,
 * checkout errors) — plain JSON lines to console, which the hosting
 * provider's own log viewer already captures. Never pass secrets (connection
 * strings, credentials, tokens) as fields; this deliberately has no
 * allowlist/redaction, so the caller is responsible for that.
 */
export function logEvent(
  category: string,
  fields: Record<string, string | number | boolean | null | undefined>,
) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      category,
      ...fields,
    }),
  );
}
