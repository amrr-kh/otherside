import type { prisma } from "@/lib/db";

type Tx = Pick<typeof prisma, "customer">;

/**
 * The customer an order belongs to. A customer who signed in with Google has
 * no phone yet, so their first order gives it to them — which files the
 * order under their own account — but only when nobody else already owns that
 * number (phone numbers are unverified, so this never merges into someone
 * else's record). Everyone else resolves by phone exactly as before.
 */
export async function resolveCheckoutCustomer(
  tx: Tx,
  input: {
    sessionCustomerId: string | null;
    name: string;
    phone: string;
    email: string;
  },
) {
  const { sessionCustomerId, name, phone, email } = input;

  if (sessionCustomerId) {
    const own = await tx.customer.findUnique({
      where: { id: sessionCustomerId },
      select: { id: true, phone: true, email: true },
    });
    if (own && own.phone === null) {
      const phoneOwner = await tx.customer.findUnique({
        where: { phone },
        select: { id: true },
      });
      if (!phoneOwner) {
        return tx.customer.update({
          where: { id: own.id },
          data: { phone, email: own.email ?? (email || undefined) },
        });
      }
    }
  }

  return tx.customer.upsert({
    where: { phone },
    update: { name, email: email || undefined },
    create: { name, phone, email: email || undefined },
  });
}
