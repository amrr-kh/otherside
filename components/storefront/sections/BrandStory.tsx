const PRINCIPLES = [
  {
    title: "Unisex by design",
    body: "Made without unnecessary labels.",
  },
  {
    title: "Built different",
    body: "Premium silhouettes and considered details.",
  },
  {
    title: "Beyond the surface",
    body: "Every piece belongs to a larger world.",
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
          <p className="max-w-md text-base leading-relaxed text-warm-white/60">
            OtherSide was created by Bidu, Eshta and Amr around one idea:
            there is always more than what appears on the surface. We create
            unisex fashion designed around individuality, perspective and the
            freedom to express different sides of yourself.
          </p>

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
