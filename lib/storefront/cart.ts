import "server-only";
import { prisma } from "@/lib/db";
import { peekGuestId } from "@/lib/guest";
import { normalizeCompareAtPrice } from "@/lib/pricing";

export type CartLine = {
  id: string;
  variantId: string;
  productSlug: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  /** Display-only original price; null unless it is genuinely higher than unitPrice. */
  compareAtUnitPrice: number | null;
  imageUrl: string | null;
};

export async function getCart(): Promise<{ items: CartLine[]; subtotal: number }> {
  const guestId = await peekGuestId();
  if (!guestId) return { items: [], subtotal: 0 };

  const cart = await prisma.cart.findUnique({
    where: { cookieToken: guestId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true,
                  options: { include: { values: true } },
                },
              },
              optionValues: true,
            },
          },
        },
      },
    },
  });
  if (!cart) return { items: [], subtotal: 0 };

  const items: CartLine[] = cart.items.map((item) => {
    const { variant } = item;
    const { product } = variant;
    const colorOption = product.options.find((o) => o.name === "Color");
    const colorValueIds = new Set(colorOption?.values.map((v) => v.id));
    const colorValue = variant.optionValues.find((ov) => colorValueIds.has(ov.id));
    const sizeValue = variant.optionValues.find((ov) => !colorValueIds.has(ov.id));
    const images = colorValue
      ? product.images.filter((img) => img.colorOptionValueId === colorValue.id)
      : product.images;

    const unitPrice = Number(item.priceSnapshot);

    return {
      id: item.id,
      variantId: variant.id,
      productSlug: product.slug,
      productName: product.name,
      color: colorValue?.value ?? "",
      size: sizeValue?.value ?? "",
      quantity: item.quantity,
      unitPrice,
      compareAtUnitPrice: normalizeCompareAtPrice(
        unitPrice,
        product.compareAtPrice == null ? null : Number(product.compareAtPrice),
      ),
      imageUrl: images[0]?.url ?? null,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { items, subtotal };
}

export async function getCartItemCount(): Promise<number> {
  const guestId = await peekGuestId();
  if (!guestId) return 0;

  const cart = await prisma.cart.findUnique({
    where: { cookieToken: guestId },
    include: { items: { select: { quantity: true } } },
  });
  return cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}
