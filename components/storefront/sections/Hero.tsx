import Link from "next/link";
import { Logo } from "../Logo";
import { PlaceholderPhoto } from "../PlaceholderPhoto";

export function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-cosmic-black">
      <PlaceholderPhoto variant="hero" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-5 pb-16 md:px-10 md:pb-24">
        <Logo markClassName="h-8 w-8" wordmarkClassName="text-xl" />

        <div>
          <h1 className="font-display text-[13vw] italic leading-[0.92] tracking-tight text-warm-white sm:text-[9vw] md:text-[6.4vw] lg:text-[88px]">
            See the
            <br />
            reality
            <br />
            behind the
            <br />
            veil.
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/hoodies"
              className="border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
            >
              Shop Hoodies
            </Link>
            <Link
              href="/pants"
              className="border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
            >
              Shop Pants
            </Link>
            <Link
              href="#drop"
              className="px-2 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white/70 underline underline-offset-4 transition-colors hover:text-warm-white"
            >
              Explore the Drop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
