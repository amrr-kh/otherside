import { NextResponse, type NextRequest } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_COOKIE_PATH,
  GOOGLE_STATE_TTL_SECONDS,
  createAuthorizationRequest,
  encodeFlow,
  isGoogleAuthConfigured,
} from "@/lib/google-oauth";
import { safeRedirectPath } from "@/lib/google-claims";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function withParam(path: string, key: string, value: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}

export function GET(request: NextRequest) {
  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(
      new URL(withParam(next, "authError", "unavailable"), getSiteUrl()),
    );
  }

  const { url, flow } = createAuthorizationRequest(next);
  const response = NextResponse.redirect(url);
  response.cookies.set(GOOGLE_STATE_COOKIE, encodeFlow(flow), {
    httpOnly: true,
    sameSite: "lax", // must survive the top-level redirect back from Google
    secure: process.env.NODE_ENV === "production",
    path: GOOGLE_STATE_COOKIE_PATH,
    maxAge: GOOGLE_STATE_TTL_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
