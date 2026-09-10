import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";

const DEFAULTS = {
  instagramUrl: "https://www.instagram.com/otherside.store.eg?stkn=cm1xdGNncm50dzE5",
  facebookUrl: "https://www.facebook.com/share/1F5XP9VSfQ/",
  tiktokUrl: "https://www.tiktok.com/@otherside.store.eg?_r=1&_t=ZS-99WuQLBr40P",
  whatsappNumber: "201559002289",
  contactEmail: "otherside.store.eg@gmail.com",
};

export type SiteSettingsData = {
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappDisplay: string;
  contactEmail: string;
  bannerEnabled: boolean;
  bannerText: string | null;
  bannerLinkUrl: string | null;
};

function formatWhatsappDisplay(number: string): string {
  // "201559002289" -> "+20 155 900 2289"
  const digits = number.replace(/\D/g, "");
  const match = /^(\d{2})(\d{3})(\d{3})(\d{4})$/.exec(digits);
  if (!match) return `+${digits}`;
  return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
}

// Cached per-request — every page that needs social links/banner shares one
// DB read instead of each issuing its own query. Falls back to the hardcoded
// defaults on a transient DB error (e.g. Neon cold start) rather than
// breaking every storefront page, since this is called from the shared
// layout.
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  let row: Awaited<ReturnType<typeof prisma.siteSettings.findFirst>> = null;
  try {
    row = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("getSiteSettings: failed to load, using defaults", error);
  }

  const whatsappNumber = row?.whatsappNumber || DEFAULTS.whatsappNumber;

  return {
    instagramUrl: row?.instagramUrl || DEFAULTS.instagramUrl,
    facebookUrl: row?.facebookUrl || DEFAULTS.facebookUrl,
    tiktokUrl: row?.tiktokUrl || DEFAULTS.tiktokUrl,
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    whatsappDisplay: formatWhatsappDisplay(whatsappNumber),
    contactEmail: row?.contactEmail || DEFAULTS.contactEmail,
    bannerEnabled: row?.bannerEnabled ?? false,
    bannerText: row?.bannerText ?? null,
    bannerLinkUrl: row?.bannerLinkUrl ?? null,
  };
});
