import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "otherside_customer_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type CustomerSessionData = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
};

/** Read-only — safe to call while rendering a page. */
export async function getCustomerSession(): Promise<CustomerSessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.customerSession.findUnique({
    where: { token },
    include: { customer: true },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return {
    id: session.customer.id,
    name: session.customer.name,
    phone: session.customer.phone,
    email: session.customer.email,
  };
}

/** Only call from a Server Action or Route Handler. */
export async function createCustomerSession(customerId: string): Promise<void> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.customerSession.create({
    data: { token, customerId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Only call from a Server Action or Route Handler. */
export async function destroyCustomerSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.customerSession.deleteMany({ where: { token } });
  }
  store.delete(SESSION_COOKIE);
}
