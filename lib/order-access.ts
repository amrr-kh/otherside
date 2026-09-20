import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Order numbers are sequential (OS-10023, OS-10024, ...), so knowing one must
// never be enough to read an order's name, phone and address. The browser that
// places an order is handed a signed, expiring, httpOnly cookie for THAT order
// only; the confirmation page accepts that cookie (or the signed-in owner) and
// nothing else. Tampering with the cookie, or presenting it for a different
// order, fails the signature check.
const COOKIE = "otherside_order_access";
const TTL_SECONDS = 60 * 60 * 24 * 7;

function secret(): string | null {
  return process.env["AUTH_SECRET"] ?? process.env["NEXTAUTH_SECRET"] ?? null;
}

function sign(orderNumber: string, expiresAt: number, key: string): string {
  return createHmac("sha256", key)
    .update(`${orderNumber}.${expiresAt}`)
    .digest("base64url");
}

/** Builds the cookie value. Exported for tests. */
export function createOrderAccessToken(
  orderNumber: string,
  key: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): string {
  const expiresAt = nowSeconds + TTL_SECONDS;
  return `${orderNumber}.${expiresAt}.${sign(orderNumber, expiresAt, key)}`;
}

/** Checks a cookie value for one specific order. Exported for tests. */
export function verifyOrderAccessToken(
  token: string | undefined,
  orderNumber: string,
  key: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenOrder, expiresRaw, signature] = parts;
  const expiresAt = Number(expiresRaw);
  if (tokenOrder !== orderNumber.toUpperCase()) return false;
  if (!Number.isInteger(expiresAt) || expiresAt < nowSeconds) return false;

  const expected = Buffer.from(sign(tokenOrder, expiresAt, key));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Call from the server action that places (or re-confirms) an order. */
export async function grantOrderAccess(orderNumber: string): Promise<void> {
  const key = secret();
  if (!key) {
    console.error("grantOrderAccess: AUTH_SECRET is not set; no access cookie issued");
    return;
  }
  const store = await cookies();
  store.set(COOKIE, createOrderAccessToken(orderNumber, key), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

/** True when this browser was given access to this order. */
export async function hasOrderAccess(orderNumber: string): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const store = await cookies();
  return verifyOrderAccessToken(store.get(COOKIE)?.value, orderNumber, key);
}
