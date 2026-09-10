import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createIntlMiddleware(routing);

// /admin stays English-only and outside the [locale] tree entirely, so it
// gets the auth check instead of locale routing; everything else is a
// customer-facing route and goes through next-intl.
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return (auth as unknown as (req: NextRequest) => Response | undefined)(
      request,
    );
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads/).*)"],
};
