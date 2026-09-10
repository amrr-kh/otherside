import { redirect } from "next/navigation";
import { getCart } from "@/lib/storefront/cart";
import { getActiveShippingZones } from "@/lib/storefront/shipping";
import { CheckoutForm } from "@/components/storefront/checkout/CheckoutForm";

export const revalidate = 0;

export default async function CheckoutPage() {
  const [{ items, subtotal }, zones] = await Promise.all([
    getCart(),
    getActiveShippingZones(),
  ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
      <CheckoutForm items={items} subtotal={subtotal} zones={zones} />
    </div>
  );
}
