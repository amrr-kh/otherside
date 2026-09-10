import { getTranslations } from "next-intl/server";

/**
 * Placeholder testimonials only — do not treat as real customer feedback.
 * Replace with approved rows from the Review table once orders exist.
 */
export async function Reviews() {
  const t = await getTranslations("reviews");

  const DEMO_REVIEWS = [t("quote1"), t("quote2"), t("quote3")];

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <h2 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {DEMO_REVIEWS.map((quote, i) => (
          <figure key={i} className="border-t border-white/10 pt-6">
            <blockquote className="text-base leading-relaxed text-warm-white/75">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.15em] text-warm-white/35">
              {t("demoLabel")}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
