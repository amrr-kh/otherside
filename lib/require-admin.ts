import "server-only";
import { auth } from "@/auth";

/**
 * Defense-in-depth: Server Actions are invoked as POSTs to the page they're
 * bound on, so proxy.ts's /admin/:path* matcher does cover them today — but
 * Next's own docs warn that a future refactor could silently move an action
 * off that matcher. Every admin mutation must check auth itself, not rely
 * on proxy alone.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: admin session required.");
  }
  return session;
}
