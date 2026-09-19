import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo-pages";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/storefront/cart";
import { getActiveShippingZones } from "@/lib/storefront/shipping";
import { getCustomerSession } from "@/lib/customer-session";
import { prisma } from "@/lib/db";
import { CheckoutForm } from "@/components/storefront/checkout/CheckoutForm";

export const revalidate = 0;

export default async function CheckoutPage() {
  const [{ items, subtotal }, zones, session] = await Promise.all([
    getCart(),
    getActiveShippingZones(),
    getCustomerSession(),
  ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  const savedAddresses = session
    ? (
        await prisma.address.findMany({
          where: { customerId: session.id },
          orderBy: { createdAt: "desc" },
        })
      ).map((a) => ({
        id: a.id,
        governorate: a.governorate,
        city: a.city,
        street: a.street,
        building: a.building,
        floor: a.floor,
        apartment: a.apartment,
        landmark: a.landmark,
      }))
    : undefined;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
      <CheckoutForm
        items={items}
        subtotal={subtotal}
        zones={zones}
        savedAddresses={savedAddresses}
        prefill={
          session
            ? { name: session.name, phone: session.phone ?? "", email: session.email ?? "" }
            : undefined
        }
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(locale, "checkout");
}
