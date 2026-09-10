"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Wired to NewsletterSubscriber once the API route exists (Phase 5+).
    setSubmitted(true);
  }

  return (
    <section className="border-t border-white/10 bg-cosmic-black">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg font-display text-4xl italic leading-[1.05] text-warm-white md:text-5xl">
            {t("line1")}
            <br />
            {t("line2")}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/35 focus:border-electric-violet focus:outline-none sm:border-r-0"
            />
            <button
              type="submit"
              className="whitespace-nowrap border border-warm-white/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
            >
              {submitted ? t("success") : t("cta")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
