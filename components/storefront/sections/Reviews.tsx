import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

export async function Reviews() {
  const t = await getTranslations("reviews");

  let realReviews: { body: string; customerName: string }[] = [];
  try {
    realReviews = await prisma.review.findMany({
      where: { isApproved: true, isDemo: false },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { body: true, customerName: true },
    });
  } catch (error) {
    console.error("Reviews: failed to load approved reviews", error);
  }

  // Only genuine, approved customer reviews are ever shown. With none yet the
  // whole section is left out rather than showing placeholder quotes.
  if (realReviews.length === 0) return null;

  const items = realReviews.map((r) => ({
    quote: r.body,
    label: r.customerName,
  }));

  return (
    <section className="bg-os-ink text-os-cream">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <h2 className="text-4xl leading-[1.08] tracking-tight md:text-5xl">
          {t("heading")}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {items.map((item, i) => (
            <figure key={i}>
              <blockquote className="text-base leading-relaxed text-os-cream/75">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[11px] uppercase tracking-[0.18em] text-os-cream/40">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
