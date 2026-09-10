import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
          404
        </p>
        <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-6xl">
          There&apos;s nothing on this side.
        </h1>
        <p className="mt-5 max-w-sm text-sm text-warm-white/55">
          The page you&apos;re looking for doesn&apos;t exist yet, or has
          moved to the other side.
        </p>
        <Link
          href="/"
          className="mt-9 border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          Back to the Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
