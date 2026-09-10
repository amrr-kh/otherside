import "server-only";
import { prisma } from "@/lib/db";

export type ShippingZoneOption = {
  id: string;
  name: string;
  governorates: string[];
  price: number;
  etaText: string;
  freeShippingThreshold: number | null;
};

export async function getActiveShippingZones(): Promise<ShippingZoneOption[]> {
  const zones = await prisma.shippingZone.findMany({
    where: { isActive: true },
  });
  return zones.map((z) => ({
    id: z.id,
    name: z.name,
    governorates: z.governorates,
    price: Number(z.price),
    etaText: z.etaText,
    freeShippingThreshold: z.freeShippingThreshold
      ? Number(z.freeShippingThreshold)
      : null,
  }));
}
