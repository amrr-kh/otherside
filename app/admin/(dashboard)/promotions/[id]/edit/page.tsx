import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { utcToCairoLocal } from "@/lib/cairo-time";
import { getLinkSuggestions } from "@/lib/admin-link-suggestions";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { updatePromotion } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPromotionPage({
  params,
}: PageProps<"/admin/promotions/[id]/edit">) {
  const { id } = await params;

  const [promotion, products, collections, linkSuggestions] = await Promise.all([
    prisma.promotion.findUnique({
      where: { id },
      include: {
        products: { select: { id: true } },
        collections: { select: { id: true } },
      },
    }),
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

  if (!promotion) notFound();

  return (
    <div>
      <Link
        href="/admin/promotions"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← Back to Limited Offer
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-soft-black">
        Edit {promotion.title}
      </h1>

      <div className="mt-8">
        <PromotionForm
          action={updatePromotion.bind(null, promotion.id)}
          submitLabel="Save Changes"
          products={products}
          collections={collections}
          linkSuggestions={linkSuggestions}
          defaultValues={{
            isActive: promotion.isActive,
            title: promotion.title,
            message: promotion.message ?? "",
            ctaText: promotion.ctaText,
            ctaUrl: promotion.ctaUrl,
            titleAr: promotion.titleAr ?? "",
            messageAr: promotion.messageAr ?? "",
            ctaTextAr: promotion.ctaTextAr ?? "",
            startsAt: utcToCairoLocal(promotion.startsAt),
            endsAt: utcToCairoLocal(promotion.endsAt),
            showTopBar: promotion.showTopBar,
            showOnProductPages: promotion.showOnProductPages,
            discountPercent:
              promotion.discountPercent === null
                ? ""
                : String(promotion.discountPercent),
            scope: promotion.scope,
            productIds: promotion.products.map((p) => p.id),
            collectionIds: promotion.collections.map((c) => c.id),
          }}
        />
      </div>
    </div>
  );
}
