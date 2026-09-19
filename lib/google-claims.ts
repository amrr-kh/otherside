// Pure (no server-only import) so it can be unit-tested outside Next.

export type GoogleProfile = {
  sub: string;
  email: string;
  name: string | null;
  picture: string | null;
};

export class GoogleAuthError extends Error {
  constructor(
    public readonly code:
      | "invalid_token"
      | "email_unverified"
      | "exchange_failed",
    message?: string,
  ) {
    super(message ?? code);
  }
}

const GOOGLE_ISSUERS = new Set([
  "https://accounts.google.com",
  "accounts.google.com",
]);

export function decodeJwtPayload(idToken: string): Record<string, unknown> {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new GoogleAuthError("invalid_token");
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(json);
    if (payload === null || typeof payload !== "object") {
      throw new Error("payload is not an object");
    }
    return payload as Record<string, unknown>;
  } catch {
    throw new GoogleAuthError("invalid_token");
  }
}

/**
 * Validates the ID token claims Google returned from the token endpoint.
 * The token arrives over TLS directly from Google's server (never from the
 * browser), which OpenID Connect Core §3.1.3.7 accepts in place of a
 * signature check — every claim that binds it to *this* login is checked.
 */
export function validateIdTokenClaims(
  claims: Record<string, unknown>,
  expected: { clientId: string; nonce: string; nowSeconds?: number },
): GoogleProfile {
  const now = expected.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (typeof claims.iss !== "string" || !GOOGLE_ISSUERS.has(claims.iss)) {
    throw new GoogleAuthError("invalid_token", "bad issuer");
  }

  const aud = claims.aud;
  const audienceOk = Array.isArray(aud)
    ? aud.includes(expected.clientId)
    : aud === expected.clientId;
  if (!audienceOk) throw new GoogleAuthError("invalid_token", "bad audience");

  if (typeof claims.exp !== "number" || claims.exp + 60 < now) {
    throw new GoogleAuthError("invalid_token", "expired");
  }
  if (typeof claims.nonce !== "string" || claims.nonce !== expected.nonce) {
    throw new GoogleAuthError("invalid_token", "bad nonce");
  }
  if (typeof claims.sub !== "string" || claims.sub === "") {
    throw new GoogleAuthError("invalid_token", "missing sub");
  }
  if (typeof claims.email !== "string" || claims.email === "") {
    throw new GoogleAuthError("invalid_token", "missing email");
  }
  if (claims.email_verified !== true) {
    throw new GoogleAuthError("email_unverified");
  }

  return {
    sub: claims.sub,
    email: claims.email.trim().toLowerCase(),
    name:
      typeof claims.name === "string" && claims.name.trim()
        ? claims.name.trim()
        : null,
    picture:
      typeof claims.picture === "string" && claims.picture.startsWith("https://")
        ? claims.picture
        : null,
  };
}

/** Only same-site, non-API, non-admin relative paths may be redirected to. */
export function safeRedirectPath(input: string | null | undefined): string {
  const fallback = "/account";
  if (!input || input.length > 300) return fallback;
  if (!input.startsWith("/") || input.startsWith("//")) return fallback;
  for (const ch of input) {
    if (ch === "\\" || ch.charCodeAt(0) < 32) return fallback;
  }
  if (/^\/(api|admin)(\/|$|\?)/.test(input)) return fallback;
  return input;
}
