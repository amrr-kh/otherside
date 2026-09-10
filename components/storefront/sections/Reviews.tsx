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

  const items =
    realReviews.length > 0
      ? realReviews.map((r) => ({ quote: r.body, label: r.customerName }))
      : [t("quote1"), t("quote2"), t("quote3")].map((quote) => ({
          quote,
          label: t("demoLabel"),
        }));

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <h2 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {items.map((item, i) => (
          <figure key={i} className="border-t border-white/10 pt-6">
            <blockquote className="text-base leading-relaxed text-warm-white/75">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.15em] text-warm-white/35">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
