"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";
import { CtaArrow } from "../Cta";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [result, setResult] = useState<"success" | "invalid" | "failed" | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await subscribeToNewsletter(email, trap);
      if (res.status === "success") {
        setResult("success");
        setEmail("");
      } else {
        setResult(res.message);
      }
    });
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
            {/* Hidden spam trap: people never see it, bots tend to fill it. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
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
              disabled={pending}
              aria-label={t("cta")}
              className="flex w-14 shrink-0 items-center justify-center bg-os-burgundy text-os-cream transition-opacity hover:opacity-90"
            >
              <CtaArrow />
            </button>
          </form>
          {result ? (
            <p role="status" className="mt-4 text-sm text-os-ink/70">
              {t(result)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
