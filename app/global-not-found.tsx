import Link from "next/link";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display-en",
  subsets: ["latin"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-sans-en",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Not Found — OtherSide",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="flex min-h-full flex-col items-center justify-center bg-bg px-6 py-32 text-center text-warm-white">
        <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
          404
        </p>
        <h1 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.02em] text-warm-white md:text-6xl">
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
      </body>
    </html>
  );
}
