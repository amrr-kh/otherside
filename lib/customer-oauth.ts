import "server-only";
import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import { Prisma } from "@/generated/prisma/client";
import type { GoogleProfile } from "@/lib/google-claims";

const PROVIDER = "google";

/**
 * Finds or creates the Customer for a verified Google identity.
 *
 * 1. Known Google account -> that customer (returning login).
 * 2. Otherwise, if exactly one existing customer has the same email, Google
 *    has just proven the visitor controls that address, so the Google
 *    identity is linked to it — this is what prevents a duplicate account
 *    for someone who already ordered or registered. Any sessions already
 *    open on that customer are revoked when the link is made.
 * 3. Otherwise a new customer is created (no phone yet; checkout asks).
 *
 * Deliberately never matches on phone: phone numbers are unverified free
 * text elsewhere on the site, so matching on one would hand another
 * person's order history to whoever typed their number.
 */
export async function signInWithGoogle(
  profile: GoogleProfile,
): Promise<{ customerId: string; outcome: "returning" | "linked" | "created" }> {
  try {
    return await run(profile);
  } catch (error) {
    // Two first-time logins racing each other hit the unique constraint on
    // (provider, providerAccountId); the loser simply becomes a returning login.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return run(profile);
    }
    throw error;
  }
}

async function run(
  profile: GoogleProfile,
): Promise<{ customerId: string; outcome: "returning" | "linked" | "created" }> {
  const existingAccount = await prisma.customerOAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: PROVIDER,
        providerAccountId: profile.sub,
      },
    },
    include: { customer: { select: { id: true, image: true } } },
  });

  if (existingAccount) {
    if (profile.picture && profile.picture !== existingAccount.customer.image) {
      await prisma.customer.update({
        where: { id: existingAccount.customer.id },
        data: { image: profile.picture },
      });
    }
    return { customerId: existingAccount.customer.id, outcome: "returning" };
  }

  const sameEmail = await prisma.customer.findMany({
    where: { email: { equals: profile.email, mode: "insensitive" } },
    select: { id: true, image: true },
    take: 2,
  });

  if (sameEmail.length === 1) {
    const target = sameEmail[0];
    await prisma.$transaction(async (tx) => {
      await tx.customerOAuthAccount.create({
        data: {
          customerId: target.id,
          provider: PROVIDER,
          providerAccountId: profile.sub,
          email: profile.email,
        },
      });
      await tx.customerSession.deleteMany({ where: { customerId: target.id } });
      if (!target.image && profile.picture) {
        await tx.customer.update({
          where: { id: target.id },
          data: { image: profile.picture },
        });
      }
    });
    logEvent("google_login", { outcome: "linked", customerId: target.id });
    return { customerId: target.id, outcome: "linked" };
  }

  const created = await prisma.customer.create({
    data: {
      name: profile.name ?? profile.email.split("@")[0],
      email: profile.email,
      image: profile.picture,
      oauthAccounts: {
        create: {
          provider: PROVIDER,
          providerAccountId: profile.sub,
          email: profile.email,
        },
      },
    },
    select: { id: true },
  });
  logEvent("google_login", { outcome: "created", customerId: created.id });
  return { customerId: created.id, outcome: "created" };
}
