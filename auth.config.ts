import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config used by middleware.ts. Deliberately excludes the
 * Credentials provider (and therefore Prisma/bcrypt), which need the
 * Node.js runtime and are wired in on top of this in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) return isLoggedIn;
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
