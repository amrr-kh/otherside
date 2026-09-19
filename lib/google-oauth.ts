import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSiteUrl } from "@/lib/site-url";
import {
  GoogleAuthError,
  decodeJwtPayload,
  validateIdTokenClaims,
  type GoogleProfile,
} from "@/lib/google-claims";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const GOOGLE_START_PATH = "/api/customer-auth/google/start";
export const GOOGLE_CALLBACK_PATH = "/api/customer-auth/google/callback";
export const GOOGLE_STATE_COOKIE = "otherside_google_oauth";
export const GOOGLE_STATE_COOKIE_PATH = "/api/customer-auth/google";
export const GOOGLE_STATE_TTL_SECONDS = 600;

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export function getGoogleRedirectUri(): string {
  return `${getSiteUrl()}${GOOGLE_CALLBACK_PATH}`;
}

export type GoogleFlowState = {
  state: string;
  codeVerifier: string;
  nonce: string;
  next: string;
};

export function createAuthorizationRequest(next: string): {
  url: string;
  flow: GoogleFlowState;
} {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured");

  const flow: GoogleFlowState = {
    state: randomBytes(32).toString("base64url"),
    codeVerifier: randomBytes(48).toString("base64url"),
    nonce: randomBytes(32).toString("base64url"),
    next,
  };
  const codeChallenge = createHash("sha256")
    .update(flow.codeVerifier)
    .digest("base64url");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state: flow.state,
    nonce: flow.nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });

  return { url: `${AUTH_ENDPOINT}?${params.toString()}`, flow };
}

export function encodeFlow(flow: GoogleFlowState): string {
  return Buffer.from(JSON.stringify(flow), "utf8").toString("base64url");
}

export function decodeFlow(value: string | undefined): GoogleFlowState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      typeof parsed?.state === "string" &&
      typeof parsed?.codeVerifier === "string" &&
      typeof parsed?.nonce === "string" &&
      typeof parsed?.next === "string"
    ) {
      return parsed as GoogleFlowState;
    }
  } catch {
    // fall through
  }
  return null;
}

export function statesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Exchanges the one-time code (server-to-server) and validates the result. */
export async function exchangeCodeForProfile(
  code: string,
  flow: GoogleFlowState,
): Promise<GoogleProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new GoogleAuthError("exchange_failed", "Google auth not configured");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleRedirectUri(),
      code_verifier: flow.codeVerifier,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // Deliberately not logging the body: it can echo request details.
    throw new GoogleAuthError(
      "exchange_failed",
      `token endpoint returned ${response.status}`,
    );
  }

  const tokens = (await response.json()) as { id_token?: unknown };
  if (typeof tokens.id_token !== "string") {
    throw new GoogleAuthError("invalid_token", "no id_token in response");
  }

  return validateIdTokenClaims(decodeJwtPayload(tokens.id_token), {
    clientId,
    nonce: flow.nonce,
  });
}
