"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";

const LINK_CLASS =
  "text-sm text-os-cream/60 transition-opacity hover:text-os-cream";
const HEADING_CLASS = "text-[11px] uppercase tracking-[0.22em] text-os-cream/40";

export function Footer({
  socialLinks,
}: {
  socialLinks: {
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    whatsappUrl: string;
  };
}) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const SHOP = [
    { href: "/hoodies", label: tNav("hoodies") },
    { href: "/pants", label: tNav("pants") },
    { href: "/collections/the-veil-study", label: tNav("theVeilStudy") },
    { href: "/create-your-own", label: tNav("createYourOwn") },
  ];
  const HELP = [
    { href: "/shipping", label: t("shipping") },
    { href: "/returns", label: t("returns") },
    { href: "/track-order", label: t("trackOrder") },
    { href: "/contact", label: t("contact") },
  ];
  const ABOUT = [
    { href: "/story", label: t("ourStory") },
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
  ];
  const SOCIAL = [
    { href: socialLinks.instagramUrl, label: "Instagram" },
    { href: socialLinks.tiktokUrl, label: "TikTok" },
    { href: socialLinks.facebookUrl, label: "Facebook" },
    { href: socialLinks.whatsappUrl, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-os-black text-os-cream" dir="auto">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10 md:pb-12 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] md:gap-x-10">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <Logo wordmarkClassName="text-lg" />
            <p className="mt-6 text-sm leading-relaxed text-os-cream/55">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className={HEADING_CLASS}>{t("shop")}</h3>
            <ul className="mt-5 space-y-3.5">
              {SHOP.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={HEADING_CLASS}>{t("help")}</h3>
            <ul className="mt-5 space-y-3.5">
              {HELP.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={HEADING_CLASS}>{t("about")}</h3>
            <ul className="mt-5 space-y-3.5">
              {ABOUT.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={HEADING_CLASS}>{t("social")}</h3>
            <ul className="mt-5 space-y-3.5">
              {SOCIAL.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASS}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 text-xs text-os-cream/40 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4">
            <Link
              href={pathname}
              locale="en"
              className={
                locale === "en"
                  ? "text-os-cream"
                  : "transition-opacity hover:text-os-cream/80"
              }
            >
              EN
            </Link>
            <span className="text-os-cream/20">/</span>
            <Link
              href={pathname}
              locale="ar"
              className={
                locale === "ar"
                  ? "text-os-cream"
                  : "transition-opacity hover:text-os-cream/80"
              }
            >
              العربية
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
