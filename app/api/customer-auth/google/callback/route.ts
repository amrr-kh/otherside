import { NextResponse, type NextRequest } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
  decodeFlow,
  exchangeCodeForProfile,
  isGoogleAuthConfigured,
  statesMatch,
} from "@/lib/google-oauth";
import { GoogleAuthError, safeRedirectPath } from "@/lib/google-claims";
import { signInWithGoogle } from "@/lib/customer-oauth";
import { issueCustomerSession } from "@/lib/customer-session";
import { getSiteUrl } from "@/lib/site-url";
import { logEvent } from "@/lib/logger";

export const dynamic = "force-dynamic";

type FailureReason = "cancelled" | "failed" | "emailUnverified" | "unavailable";

function withParam(path: string, key: string, value: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}

function finish(response: NextResponse): NextResponse {
  // The one-time flow cookie is always cleared, success or failure.
  response.cookies.set(GOOGLE_STATE_COOKIE, "", {
    path: GOOGLE_STATE_COOKIE_PATH,
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function fail(next: string, reason: FailureReason): NextResponse {
  return finish(
    NextResponse.redirect(
      new URL(withParam(next, "authError", reason), getSiteUrl()),
    ),
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const flow = decodeFlow(request.cookies.get(GOOGLE_STATE_COOKIE)?.value);
  const next = safeRedirectPath(flow?.next);

  if (!isGoogleAuthConfigured()) return fail(next, "unavailable");

  // The user closed or declined Google's consent screen.
  const googleError = params.get("error");
  if (googleError) {
    return fail(next, googleError === "access_denied" ? "cancelled" : "failed");
  }

  const code = params.get("code");
  const state = params.get("state");
  // No cookie (expired / different browser) or a state that isn't the one we
  // issued to this browser: treat as a forged or stale callback.
  if (!flow || !code || !state || !statesMatch(state, flow.state)) {
    logEvent("google_login_rejected", { reason: "state_mismatch" });
    return fail(next, "failed");
  }

  try {
    const profile = await exchangeCodeForProfile(code, flow);
    const { customerId } = await signInWithGoogle(profile);
    const session = await issueCustomerSession(customerId);

    const response = finish(
      NextResponse.redirect(new URL(next, getSiteUrl())),
    );
    response.cookies.set(session.name, session.value, session.options);
    return response;
  } catch (error) {
    if (error instanceof GoogleAuthError && error.code === "email_unverified") {
      return fail(next, "emailUnverified");
    }
    logEvent("google_login_failed", {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      code: error instanceof GoogleAuthError ? error.code : null,
      detail: error instanceof GoogleAuthError ? error.message : null,
    });
    return fail(next, "failed");
  }
}
