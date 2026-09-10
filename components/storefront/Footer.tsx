"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { SOCIAL_LINKS } from "@/lib/social";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <footer className="border-t border-white/10 bg-cosmic-black" dir="auto">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo wordmarkClassName="text-lg" />
            <p className="mt-5 text-sm leading-relaxed text-warm-white/50">
              {t("tagline")}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-warm-white/35">
              {t("subtagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-white">
              {t("shop")}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/hoodies"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {tNav("hoodies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pants"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {tNav("pants")}
                </Link>
              </li>
              <li>
                <Link
                  href="/create-your-own"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {tNav("createYourOwn")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-white">
              {t("help")}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/track-order"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {t("trackOrder")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-white">
              {t("about")}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/story"
                  className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                >
                  {t("ourStory")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-white">
              {t("social")}
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                { href: SOCIAL_LINKS.instagram, label: "Instagram" },
                { href: SOCIAL_LINKS.tiktok, label: "TikTok" },
                { href: SOCIAL_LINKS.facebook, label: "Facebook" },
                { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-warm-white/55 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-warm-white/40 md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-5">
            <Link
              href={pathname}
              locale="en"
              className={
                locale === "en"
                  ? "text-warm-white"
                  : "text-warm-white/50 hover:text-warm-white/70"
              }
            >
              EN
            </Link>
            <span className="text-warm-white/20">/</span>
            <Link
              href={pathname}
              locale="ar"
              className={
                locale === "ar"
                  ? "text-warm-white"
                  : "text-warm-white/50 hover:text-warm-white/70"
              }
            >
              العربية
            </Link>
            <span className="mx-2 text-warm-white/20">|</span>
            <Link href="/privacy" className="hover:text-warm-white/70">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-warm-white/70">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
