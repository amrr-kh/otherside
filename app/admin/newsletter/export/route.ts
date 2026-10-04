import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

// CSV of all subscribers, admin only (also covered by proxy's /admin matcher).
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  const rows = ["email,subscribed_at"];
  for (const s of subscribers) {
    rows.push(`${s.email.replace(/"/g, '""')},${s.subscribedAt.toISOString()}`);
  }

  return new Response(rows.join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="otherside-newsletter.csv"',
      "cache-control": "no-store",
    },
  });
}
