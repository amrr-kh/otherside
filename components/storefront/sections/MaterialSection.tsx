import Link from "next/link";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export function MaterialSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto">
        <PlaceholderPhoto variant="fabric" className="absolute inset-0" />
      </div>
      <div className="flex flex-col justify-center gap-6 bg-dark-purple/40 px-6 py-20 md:px-16 md:py-0">
        <p className="text-xs uppercase tracking-[0.25em] text-magenta">
          Complete the Look
        </p>
        <h2 className="font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
          Layer the unseen.
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-warm-white/60">
          The silhouette that will bring your two sides together.
        </p>
        <Link
          href="/collections/uniform"
          className="w-fit text-xs uppercase tracking-[0.18em] text-warm-white underline underline-offset-4 hover:text-warm-white/70"
        >
          Discover the Details
        </Link>
      </div>
    </section>
  );
}
