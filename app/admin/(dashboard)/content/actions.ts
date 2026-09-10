"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function clean(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  const data = {
    instagramUrl: clean(formData, "instagramUrl"),
    facebookUrl: clean(formData, "facebookUrl"),
    tiktokUrl: clean(formData, "tiktokUrl"),
    whatsappNumber: clean(formData, "whatsappNumber")?.replace(/\D/g, "") || null,
    contactEmail: clean(formData, "contactEmail"),
    bannerEnabled: formData.get("bannerEnabled") === "on",
    bannerText: clean(formData, "bannerText"),
    bannerLinkUrl: clean(formData, "bannerLinkUrl"),
  };

  const existing = await prisma.siteSettings.findFirst({ select: { id: true } });

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  // Bust the ISR cache for every locale's storefront tree (the layout that
  // reads getSiteSettings) so the banner/social links update immediately
  // instead of waiting out each page's own revalidate window.
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/content");
}
