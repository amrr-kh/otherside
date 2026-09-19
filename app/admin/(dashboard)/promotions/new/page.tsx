import Link from "next/link";
import { prisma } from "@/lib/db";
import { utcToCairoLocal } from "@/lib/cairo-time";
import { getLinkSuggestions } from "@/lib/admin-link-suggestions";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { createPromotion } from "../actions";

// Always read the current time and catalog, never a cached copy.
export const dynamic = "force-dynamic";

export default async function NewPromotionPage() {
  const [products, collections, linkSuggestions] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.collection.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    getLinkSuggestions(),
  ]);

  // Suggest "now" to three days from now, in Cairo time. New offers start OFF.
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div>
      <Link
        href="/admin/promotions"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← Back to Limited Offer
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-soft-black">New Offer</h1>

      <div className="mt-8">
        <PromotionForm
          action={createPromotion}
          submitLabel="Create Offer"
          products={products}
          collections={collections}
          linkSuggestions={linkSuggestions}
          defaultValues={{
            isActive: false,
            title: "LIMITED OFFER",
            message: "",
            ctaText: "SHOP NOW",
            ctaUrl: "/hoodies",
            titleAr: "",
            messageAr: "",
            ctaTextAr: "",
            startsAt: utcToCairoLocal(now),
            endsAt: utcToCairoLocal(inThreeDays),
            showTopBar: true,
            showOnProductPages: true,
            discountPercent: "",
            scope: "STORE",
            productIds: [],
            collectionIds: [],
          }}
        />
      </div>
    </div>
  );
}
