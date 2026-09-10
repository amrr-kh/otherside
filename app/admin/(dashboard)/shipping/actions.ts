"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function parseGovernorates(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

export async function createShippingZone(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const governorates = parseGovernorates(formData.get("governorates"));
  const price = Number(formData.get("price"));
  const etaText = String(formData.get("etaText") ?? "").trim();
  const freeShippingThresholdRaw = formData.get("freeShippingThreshold");
  const freeShippingThreshold =
    typeof freeShippingThresholdRaw === "string" &&
    freeShippingThresholdRaw.trim() !== ""
      ? Number(freeShippingThresholdRaw)
      : null;

  if (!name) throw new Error("Zone name is required.");
  if (governorates.length === 0) throw new Error("Add at least one governorate.");
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }
  if (!etaText) throw new Error("Delivery estimate is required.");

  await prisma.shippingZone.create({
    data: { name, governorates, price, etaText, freeShippingThreshold },
  });

  revalidatePath("/admin/shipping");
}

export async function toggleShippingZone(zoneId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.shippingZone.update({
    where: { id: zoneId },
    data: { isActive },
  });
  revalidatePath("/admin/shipping");
}

export async function updateShippingZonePrice(
  zoneId: string,
  formData: FormData,
) {
  await requireAdmin();
  const price = Number(formData.get("price"));
  const etaText = String(formData.get("etaText") ?? "").trim();
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }
  if (!etaText) throw new Error("Delivery estimate is required.");

  await prisma.shippingZone.update({
    where: { id: zoneId },
    data: { price, etaText },
  });
  revalidatePath("/admin/shipping");
}

export async function deleteShippingZone(zoneId: string) {
  await requireAdmin();
  await prisma.shippingZone.delete({ where: { id: zoneId } });
  revalidatePath("/admin/shipping");
}
