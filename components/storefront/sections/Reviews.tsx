const DEMO_REVIEWS = [
  {
    quote: "The fit is impossibly good. Structured, oversized, still clean.",
    name: "Demo review",
  },
  {
    quote: "It feels considered in every detail, even the weight of the fabric.",
    name: "Demo review",
  },
  {
    quote: "Not loud. Just unforgettable.",
    name: "Demo review",
  },
];

/**
 * Placeholder testimonials only — do not treat as real customer feedback.
 * Replace with approved rows from the Review table once orders exist.
 */
export function Reviews() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <h2 className="font-display text-4xl italic text-warm-white md:text-5xl">
        In their words.
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {DEMO_REVIEWS.map((r, i) => (
          <figure key={i} className="border-t border-white/10 pt-6">
            <blockquote className="text-base leading-relaxed text-warm-white/75">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.15em] text-warm-white/35">
              {r.name} · placeholder
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
