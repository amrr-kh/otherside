import type { prisma } from "@/lib/db";

type Db = Pick<typeof prisma, "address">;

export type AddressInput = {
  governorate: string;
  city: string;
  street: string;
  building: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
};

function clean(value: string | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

export function normalizeAddress(input: AddressInput) {
  return {
    governorate: input.governorate.trim(),
    city: input.city.trim(),
    street: input.street.trim(),
    building: input.building.trim(),
    floor: clean(input.floor),
    apartment: clean(input.apartment),
    landmark: clean(input.landmark),
  };
}

/**
 * Saves the address unless this customer already has exactly the same one,
 * so ordering to the same place again doesn't pile up duplicates.
 */
export async function saveAddressIfNew(
  db: Db,
  customerId: string,
  input: AddressInput,
) {
  const address = normalizeAddress(input);
  const existing = await db.address.findFirst({
    where: { customerId, ...address },
  });
  if (existing) return existing;
  return db.address.create({ data: { customerId, ...address } });
}
