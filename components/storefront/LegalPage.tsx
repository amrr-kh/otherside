export function LegalPage({
  title,
  lastUpdated,
  lastUpdatedLabel = "Last Updated",
  note,
  children,
}: {
  title: string;
  lastUpdated: string;
  lastUpdatedLabel?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <h1 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-xs uppercase tracking-[0.15em] text-warm-white/40">
        {lastUpdatedLabel}: {lastUpdated}
      </p>
      {note ? (
        <p className="mt-4 border-s-2 border-electric-violet/50 ps-4 text-xs leading-relaxed text-warm-white/45">
          {note}
        </p>
      ) : null}

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-warm-white/60">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
        {heading}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
