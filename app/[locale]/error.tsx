"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Next redacts the real error message from the client bundle in production
// automatically, but we never render error.message here regardless — a
// customer must never see a Prisma/SQL/internal error, only a friendly
// message plus the digest they could quote to support if needed.
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-6xl">
        {t("heading")}
      </h1>
      <p className="mt-5 max-w-sm text-sm text-warm-white/55">{t("body")}</p>
      {error.digest ? (
        <p className="mt-2 text-xs text-warm-white/30" dir="ltr">
          {error.digest}
        </p>
      ) : null}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="px-2 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white/70 underline underline-offset-4 hover:text-warm-white"
        >
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
