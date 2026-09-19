import Link from "next/link";
import { prisma } from "@/lib/db";
import { utcToCairoLocal } from "@/lib/cairo-time";
import { setPromotionActive, deletePromotion } from "./actions";

const SCOPE_LABELS = {
  STORE: "Entire store",
  COLLECTIONS: "Specific collections",
  PRODUCTS: "Specific products",
} as const;

function cairoText(date: Date) {
  return `${utcToCairoLocal(date).replace("T", " ")} (Cairo)`;
}

function statusOf(p: { isActive: boolean; startsAt: Date; endsAt: Date }) {
  const now = Date.now();
  if (!p.isActive) return { label: "OFF", note: "Not shown anywhere.", tone: "off" };
  if (p.endsAt.getTime() <= now) {
    return { label: "ENDED", note: "The end time has passed.", tone: "ended" };
  }
  if (p.startsAt.getTime() > now) {
    return { label: "SCHEDULED", note: "Waiting for the start time.", tone: "scheduled" };
  }
  return { label: "LIVE", note: "Showing on the website now.", tone: "live" };
}

const TONES: Record<string, string> = {
  live: "bg-electric-violet/15 text-electric-violet",
  scheduled: "bg-soft-black/10 text-soft-black/70",
  ended: "bg-soft-black/10 text-soft-black/40",
  off: "bg-soft-black/10 text-soft-black/50",
};

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: { select: { name: true } },
      collections: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-soft-black">
            Limited Offer
          </h1>
          <p className="mt-1 text-sm text-soft-black/50">
            A countdown for a genuine time-limited offer. It only appears while
            it is switched on and between its start and end. The same real
            deadline applies to every customer.
          </p>
        </div>
        <Link
          href="/admin/promotions/new"
          className="shrink-0 bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
        >
          New Offer
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {promotions.map((promotion) => {
          const status = statusOf(promotion);
          const targets =
            promotion.scope === "PRODUCTS"
              ? promotion.products.map((p) => p.name).join(", ")
              : promotion.scope === "COLLECTIONS"
                ? promotion.collections.map((c) => c.name).join(", ")
                : "";
          return (
            <div
              key={promotion.id}
              className="rounded-lg border border-soft-black/10 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${TONES[status.tone]}`}
                    >
                      {status.label}
                    </span>
                    <h2 className="truncate text-sm font-semibold text-soft-black">
                      {promotion.title}
                    </h2>
                    {promotion.discountPercent !== null ? (
                      <span className="shrink-0 rounded border border-electric-violet/40 px-2 py-0.5 text-xs font-medium text-electric-violet">
                        {promotion.discountPercent}% off
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs text-soft-black/50">
                    {cairoText(promotion.startsAt)} → {cairoText(promotion.endsAt)}
                  </p>
                  <p className="mt-1 text-xs text-soft-black/50">
                    {promotion.discountPercent !== null
                      ? `Lowers prices by ${promotion.discountPercent}% (${SCOPE_LABELS[promotion.scope]}) · `
                      : null}
                    {promotion.showTopBar ? "Top bar" : null}
                    {promotion.showTopBar && promotion.showOnProductPages ? " · " : null}
                    {promotion.showOnProductPages
                      ? `Product pages: ${SCOPE_LABELS[promotion.scope]}${targets ? ` (${targets})` : ""}`
                      : null}
                    {` · Button: ${promotion.ctaText} → ${promotion.ctaUrl}`}
                  </p>
                  <p className="mt-1 text-xs text-soft-black/40">{status.note}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <form
                    action={setPromotionActive.bind(
                      null,
                      promotion.id,
                      !promotion.isActive,
                    )}
                  >
                    <button
                      type="submit"
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        promotion.isActive
                          ? "bg-electric-violet/15 text-electric-violet"
                          : "bg-soft-black/10 text-soft-black/50"
                      }`}
                    >
                      {promotion.isActive ? "TURN OFF" : "TURN ON"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/promotions/${promotion.id}/edit`}
                    className="text-xs uppercase tracking-[0.1em] text-electric-violet hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={deletePromotion.bind(null, promotion.id)}>
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}

        {promotions.length === 0 ? (
          <p className="text-sm text-soft-black/50">
            No offers yet. Nothing countdown-related appears on the website
            until you create one and switch it on.
          </p>
        ) : null}
      </div>
    </div>
  );
}
