"use server";

import { prisma } from "@/lib/db";

export type SubscribeResult =
  | { status: "success" }
  | { status: "error"; message: "invalid" | "failed" };

// Deliberately simple address check; the real test is whether a mail arrives.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribeToNewsletter(
  rawEmail: string,
  honeypot: string,
): Promise<SubscribeResult> {
  // Real visitors never see or fill the hidden field; bots usually do.
  // Answer "success" so a bot learns nothing.
  if (honeypot) return { status: "success" };

  const email = String(rawEmail ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "invalid" };
  }

  try {
    // Already subscribed is still a success, and keeps the original date.
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { status: "success" };
  } catch (error) {
    console.error("newsletter: subscribe failed", error);
    return { status: "error", message: "failed" };
  }
}
