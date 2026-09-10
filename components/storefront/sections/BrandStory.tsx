import Link from "next/link";

const PRINCIPLES = [
  {
    title: "Unisex by design",
    body: "No unnecessary labels, no fixed rules.",
  },
  {
    title: "Built different",
    body: "Strong silhouettes, comfort, individuality.",
  },
  {
    title: "Beyond the surface",
    body: "What you see is never the whole story.",
  },
];

export function BrandStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            The OtherSide — 01
          </p>
          <h2 className="mt-5 font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
            The reality is
            <br />
            in the details.
          </h2>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-warm-white/60">
              OtherSide was founded by Bidu, Eshta, and Amr with one idea:
              what you see on the surface is never the whole story. We
              create premium unisex pieces built around strong silhouettes,
              comfort, individuality, and everyday wear — no unnecessary
              labels, no fixed rules.
            </p>
            <Link
              href="/story"
              className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-warm-white/70 underline underline-offset-4 hover:text-warm-white"
            >
              Read Our Story
            </Link>
          </div>

          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-white">
                  {p.title}
                </dt>
                <dd className="mt-2 text-sm text-warm-white/50">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
