import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const GUEST_COOKIE = "otherside_guest";

/**
 * Read-only — safe to call while rendering a page. Returns null if this
 * visitor has no cart/wishlist yet; never sets a cookie (Next.js only
 * allows writing cookies from a Server Action or Route Handler).
 */
export async function peekGuestId(): Promise<string | null> {
  const store = await cookies();
  return store.get(GUEST_COOKIE)?.value ?? null;
}

/**
 * Only call from a Server Action or Route Handler — creates the guest id
 * cookie on first use. Reused as both Cart.cookieToken and
 * Wishlist.guestToken so cart + wishlist survive a session without an account.
 */
export async function getOrCreateGuestId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(GUEST_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}
