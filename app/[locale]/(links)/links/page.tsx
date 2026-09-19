import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HubLink } from "@/components/links/HubLink";
import { LinkHubTracker } from "@/components/links/LinkHubTracker";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/links/SocialIcons";
import { LogoMark } from "@/components/storefront/Logo";
import {
  getCategoryProductsByColor,
  getCollectionProductsByColor,
  type StorefrontProduct,
} from "@/lib/storefront/products";
import { getSiteSettings } from "@/lib/site-settings";
import {
  SITE_NAME,
  buildOpenGraph,
  buildTwitter,
  pageAlternates,
  trimDescription,
} from "@/lib/seo";

// Static and served from the edge; refreshed so new product photos and
// social-link edits made in the admin show up within minutes.
export const revalidate = 300;

// Lets the layout use the full screen on notched phones; the safe-area
// padding below keeps content clear of the notch and the home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#1d1111",
};

const VEIL_STUDY_COLLECTION_SLUG = "the-veil-study";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/links">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("linksTitle");
  const description = trimDescription(t("linksDescription"));

  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(locale, "/links"),
    openGraph: buildOpenGraph({ locale, path: "/links", title, description }),
    twitter: buildTwitter({ title, description }),
  };
}

// Art direction: which color of each product to feature, in order of
// preference. Falls back to whatever exists if a color is removed.
function pickPhoto(
  cards: StorefrontProduct[],
  preferredColorSlugs: string[],
  exclude?: string | null,
): string | null {
  const usable = cards.filter(
    (card) => card.primaryImageUrl && card.primaryImageUrl !== exclude,
  );
  for (const slug of preferredColorSlugs) {
    const match = usable.find((card) => card.colorSlug === slug);
    if (match) return match.primaryImageUrl;
  }
  return usable[0]?.primaryImageUrl ?? cards[0]?.primaryImageUrl ?? null;
}

async function loadPhotos() {
  try {
    const [veilCards, hoodieCards, pantsCards] = await Promise.all([
      getCollectionProductsByColor(VEIL_STUDY_COLLECTION_SLUG),
      getCategoryProductsByColor("hoodies"),
      getCategoryProductsByColor("pants"),
    ]);
    const veil = pickPhoto(veilCards, ["green", "black"]);
    return {
      veil,
      hoodies: pickPhoto(hoodieCards, ["cream", "brown"], veil),
      pants: pickPhoto(pantsCards, ["charcoal", "black"]),
      hasVeilCollection: veilCards.length > 0,
    };
  } catch (error) {
    // The links themselves are static, so the page still works without photos.
    console.error("LinksPage: failed to load photos", error);
    return { veil: null, hoodies: null, pants: null, hasVeilCollection: true };
  }
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-white";

function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-dark-purple via-soft-black to-cosmic-black" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${className}`}
    />
  );
}

export default async function LinksPage({
  params,
}: PageProps<"/[locale]/links">) {
  const { locale } = await params;
  const [t, tNav, settings, photos] = await Promise.all([
    getTranslations("links"),
    getTranslations("nav"),
    getSiteSettings(),
    loadPhotos(),
  ]);

  const otherLocale = locale === "ar" ? "en" : "ar";
  const whatsappHref = `${settings.whatsappUrl}?text=${encodeURIComponent(
    t("whatsappMessage"),
  )}`;
  const veilHref = photos.hasVeilCollection
    ? `/collections/${VEIL_STUDY_COLLECTION_SLUG}`
    : "/#drop";

  const socials = [
    { name: "instagram", href: settings.instagramUrl, label: t("instagram"), icon: <InstagramIcon /> },
    { name: "tiktok", href: settings.tiktokUrl, label: t("tiktok"), icon: <TikTokIcon /> },
    { name: "facebook", href: settings.facebookUrl, label: t("facebook"), icon: <FacebookIcon /> },
  ];

  return (
    <main
      id="main"
      className="relative flex flex-1 flex-col overflow-x-clip bg-bg pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(110%_75%_at_50%_0%,rgba(107,41,48,0.55),transparent_72%)]"
      />

      <LinkHubTracker>
        <div className="relative mx-auto flex w-full max-w-[30rem] flex-col px-5">
          {/* Brand */}
          <header>
            <div
              className="hub-rise flex items-center justify-between"
              style={{ "--hub-i": 0 } as React.CSSProperties}
            >
              <LogoMark className="h-7 w-7 text-warm-white" />
              <Link
                href="/links"
                locale={otherLocale}
                aria-label={t("switchLanguageLabel")}
                className={`flex min-h-11 items-center px-2 text-xs uppercase tracking-[0.18em] rtl:tracking-normal text-warm-white/60 transition-colors hover:text-warm-white ${focusRing}`}
              >
                {t("switchLanguage")}
              </Link>
            </div>

            <div
              className="hub-rise mt-6"
              style={{ "--hub-i": 1 } as React.CSSProperties}
            >
              <h1 className="font-display text-[3.25rem] italic leading-none tracking-tight text-warm-white">
                {SITE_NAME}
              </h1>
              <p className="mt-4 font-display text-[1.7rem] italic leading-[1.12] text-warm-white/90">
                {t("tagline")}
                <br />
                <span className="hub-veil inline-block text-gold">
                  {t("taglineReveal")}
                </span>
              </p>
            </div>
          </header>

          {/* Shop */}
          <nav aria-labelledby="hub-shop" className="mt-8">
            <h2
              id="hub-shop"
              className="hub-rise mb-3 text-[11px] font-medium uppercase tracking-[0.28em] rtl:tracking-normal text-warm-white/45"
              style={{ "--hub-i": 2 } as React.CSSProperties}
            >
              {t("shopLabel")}
            </h2>

            <div
              className="hub-rise"
              style={{ "--hub-i": 3 } as React.CSSProperties}
            >
              <HubLink
                href={veilHref}
                name="shop_veil_study"
                section="shop"
                position={1}
                className={`group relative block aspect-[4/3] overflow-hidden bg-soft-black ${focusRing}`}
              >
                <Photo
                  src={photos.veil}
                  alt=""
                  priority
                  sizes="(min-width: 480px) 448px, 100vw"
                  className="object-[50%_18%]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/25 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <span>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.28em] rtl:tracking-normal text-gold">
                      {t("veilEyebrow")}
                    </span>
                    <span className="mt-1.5 block font-display text-[1.65rem] italic leading-tight text-warm-white">
                      {t("veilCta")}
                    </span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-warm-white/60 text-warm-white transition-colors group-hover:bg-warm-white group-hover:text-bg">
                    <ArrowRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  </span>
                </span>
              </HubLink>
            </div>

            <div
              className="hub-rise mt-3 grid grid-cols-2 gap-3"
              style={{ "--hub-i": 4 } as React.CSSProperties}
            >
              {[
                { name: "hoodies", href: "/hoodies", label: tNav("hoodies"), photo: photos.hoodies, position: 2 },
                { name: "wide_leg_pants", href: "/pants", label: t("pants"), photo: photos.pants, position: 3 },
              ].map((card) => (
                <HubLink
                  key={card.name}
                  href={card.href}
                  name={card.name}
                  section="shop"
                  position={card.position}
                  className={`group relative block aspect-[4/5] overflow-hidden bg-soft-black ${focusRing}`}
                >
                  <Photo
                    src={card.photo}
                    alt=""
                    sizes="(min-width: 480px) 220px, 46vw"
                    className="object-[50%_25%]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                    <span className="text-xs font-medium uppercase leading-snug tracking-[0.14em] rtl:tracking-normal text-warm-white">
                      {card.label}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-warm-white/80 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </HubLink>
              ))}
            </div>
          </nav>

          {/* Support */}
          <nav
            aria-label={t("helpLabel")}
            className="hub-rise mt-3 flex flex-col gap-3"
            style={{ "--hub-i": 5 } as React.CSSProperties}
          >
            <HubLink
              href="/create-your-own"
              name="create_your_own"
              section="shop"
              position={4}
              className={`group flex min-h-[4.5rem] items-center justify-between gap-4 border border-gold/70 px-5 py-4 transition-colors hover:bg-gold/10 ${focusRing}`}
            >
              <span>
                <span className="block text-xs font-medium uppercase tracking-[0.18em] rtl:tracking-normal text-warm-white">
                  {t("createTitle")}
                </span>
                <span className="mt-1 block text-sm leading-snug text-warm-white/55">
                  {t("createBody")}
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </HubLink>

            <HubLink
              href={whatsappHref}
              external
              name="whatsapp"
              section="support"
              position={5}
              aria-label={`${t("whatsappCta")} (${t("opensInNewTab")})`}
              className={`flex min-h-14 items-center justify-center gap-3 bg-warm-white px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] rtl:tracking-normal text-bg transition-opacity hover:opacity-90 ${focusRing}`}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {t("whatsappCta")}
            </HubLink>

            <HubLink
              href="/track-order"
              name="track_order"
              section="support"
              position={6}
              className={`flex min-h-14 items-center justify-between gap-3 border border-warm-white/25 px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] rtl:tracking-normal text-warm-white transition-colors hover:border-warm-white/70 ${focusRing}`}
            >
              {t("trackOrder")}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </HubLink>
          </nav>

          {/* Help + social + footer */}
          <footer
            className="hub-rise mt-10 border-t border-warm-white/10 pt-6"
            style={{ "--hub-i": 6 } as React.CSSProperties}
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-warm-white/55">
              {[
                { name: "shipping", href: "/shipping", label: t("shipping"), position: 7 },
                { name: "returns", href: "/returns", label: t("returns"), position: 8 },
                { name: "contact", href: "/contact", label: t("contact"), position: 9 },
              ].map((item) => (
                <li key={item.name}>
                  <HubLink
                    href={item.href}
                    name={item.name}
                    section="help"
                    position={item.position}
                    className={`flex min-h-11 items-center transition-colors hover:text-warm-white ${focusRing}`}
                  >
                    {item.label}
                  </HubLink>
                </li>
              ))}
            </ul>

            <ul
              aria-label={t("followLabel")}
              className="-ms-3 mt-3 flex items-center gap-1"
            >
              {socials.map((social, index) => (
                <li key={social.name}>
                  <HubLink
                    href={social.href}
                    external
                    name={social.name}
                    section="social"
                    position={10 + index}
                    aria-label={`${social.label} (${t("opensInNewTab")})`}
                    className={`flex h-11 w-11 items-center justify-center text-warm-white/70 transition-colors hover:text-warm-white ${focusRing}`}
                  >
                    {social.icon}
                  </HubLink>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between gap-4 text-xs text-warm-white/40">
              <span className="flex items-center gap-2 text-warm-white/60">
                <LogoMark className="h-5 w-5" />
                <span className="font-display text-base italic">{SITE_NAME}</span>
              </span>
              <span>{t("copyright", { year: new Date().getFullYear() })}</span>
            </div>
          </footer>
        </div>
      </LinkHubTracker>
    </main>
  );
}
