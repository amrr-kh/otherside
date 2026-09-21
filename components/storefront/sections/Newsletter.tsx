"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CtaArrow } from "../Cta";

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
    <section
      className="bg-os-cream text-os-ink"
      style={{ colorScheme: "light" }}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-2 md:items-end md:gap-24 md:px-10 md:py-32">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-os-burgundy">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 max-w-md text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {t("line1")}
            <br />
            {t("line2")}
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-os-ink/65">
            {t("body")}
          </p>
        </div>

        <div className="w-full max-w-md md:justify-self-end">
          <form onSubmit={handleSubmit} className="group/cta flex">
            <input
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              className="min-w-0 flex-1 border border-os-ink/25 bg-transparent px-4 py-4 text-sm text-os-ink placeholder:text-os-ink/40 focus:border-os-burgundy focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t("cta")}
              className="flex w-14 shrink-0 items-center justify-center bg-os-burgundy text-os-cream transition-opacity hover:opacity-90"
            >
              <CtaArrow />
            </button>
          </form>
          {submitted ? (
            <p role="status" className="mt-4 text-sm text-os-ink/70">
              {t("success")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
