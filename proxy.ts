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
  // robots.txt, sitemap.xml and the social image are root-level files — the
  // locale middleware would otherwise rewrite them into /en/... and 404 them.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads/|robots.txt|sitemap.xml|opengraph-image|twitter-image).*)",
  ],
};
