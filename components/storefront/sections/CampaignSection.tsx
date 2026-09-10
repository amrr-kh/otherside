import Link from "next/link";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export function CampaignSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 bg-soft-black px-6 py-20 md:px-16 md:py-0">
        <h2 className="font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
          Make the
          <br />
          silhouette
          <br />
          yours.
        </h2>
        <p className="max-w-xs text-sm text-warm-white/55">
          Your side. Your movement. Your way.
        </p>
        <Link
          href="/create-your-own"
          className="w-fit border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          Explore the Collection
        </Link>
      </div>
      <div className="relative aspect-[4/5] md:aspect-auto">
        <PlaceholderPhoto variant="lifestyle" className="absolute inset-0" />
      </div>
    </section>
  );
}
