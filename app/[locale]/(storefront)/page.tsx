import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";
import {
  SITE_NAME,
  buildOpenGraph,
  buildTwitter,
  pageAlternates,
  trimDescription,
} from "@/lib/seo";
import { Hero } from "@/components/storefront/sections/Hero";
import { Intro } from "@/components/storefront/sections/Intro";
import { BrandStory } from "@/components/storefront/sections/BrandStory";
import { DropSection } from "@/components/storefront/sections/DropSection";
import { EditorialFeature } from "@/components/storefront/sections/EditorialFeature";
import { CampaignSection } from "@/components/storefront/sections/CampaignSection";
import { SelectedProducts } from "@/components/storefront/sections/SelectedProducts";
import { MaterialSection } from "@/components/storefront/sections/MaterialSection";
import { Reviews } from "@/components/storefront/sections/Reviews";
import { Newsletter } from "@/components/storefront/sections/Newsletter";

// Product sections read from the database — without this the homepage would
// bake in build-time data and never show newly added products.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("homeTitle");
  const description = trimDescription(t("homeDescription"));

  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(locale, "/"),
    openGraph: buildOpenGraph({ locale, path: "/", title, description }),
    twitter: buildTwitter({ title, description }),
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const site = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site}/#organization`,
    name: SITE_NAME,
    url: site,
    sameAs: [settings.instagramUrl, settings.facebookUrl, settings.tiktokUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: settings.contactEmail,
      telephone: `+${settings.whatsappNumber}`,
      areaServed: "EG",
      availableLanguage: ["English", "Arabic"],
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: site,
    name: SITE_NAME,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${site}/#organization` },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <Hero />
      <Intro />
      <DropSection />
      <SelectedProducts />
      <EditorialFeature />
      <CampaignSection />
      <BrandStory />
      <MaterialSection />
      <Reviews />
      <Newsletter />
    </>
  );
}
