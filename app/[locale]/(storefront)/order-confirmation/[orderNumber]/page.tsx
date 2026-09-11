import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 0;

const PAYMENT_KEYS: Record<string, string> = {
  COD: "paymentCod",
  INSTAPAY: "paymentInstapay",
  MOBILE_WALLET: "paymentWallet",
};

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/[locale]/order-confirmation/[orderNumber]">) {
  const { orderNumber } = await params;
  const [t, settings, order] = await Promise.all([
    getTranslations("orderConfirmation"),
    getSiteSettings(),
    prisma.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase() },
      include: { items: true },
    }),
  ]);

  if (!order) notFound();

  const address = order.addressSnapshot as {
    name: string;
    phone: string;
    governorate: string;
    city: string;
    street: string;
    building: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
  };

  const whatsappMessage = t("whatsappMessage", {
    orderNumber: order.orderNumber,
    total: Number(order.total).toLocaleString(),
    name: address.name,
    phone: address.phone,
    city: address.city,
    governorate: address.governorate,
  });
  const whatsappHref = `${settings.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-3 text-sm text-warm-white/55">{t("intro")}</p>

      <div className="mt-10 border-t border-warm-white/10 pt-8">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-[0.1em] text-warm-white/50">
            {t("orderNumber")}
          </span>
          <span className="font-display text-xl italic text-warm-white" dir="ltr">
            {order.orderNumber}
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-2 border-t border-warm-white/10 pt-6 text-sm text-warm-white/70">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.productNameSnapshot} — {item.colorSnapshot} /{" "}
              {item.sizeSnapshot} × {item.quantity}
            </span>
            <span className="text-gold">
              EGP {(Number(item.unitPrice) * item.quantity).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 border-t border-warm-white/10 pt-6 text-sm">
        <div className="flex justify-between gap-3 text-warm-white/60">
          <span>{t("subtotal")}</span>
          <span className="text-end">EGP {Number(order.subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-3 text-warm-white/60">
          <span>{t("shipping")}</span>
          <span className="text-end">EGP {Number(order.shippingCost).toLocaleString()}</span>
        </div>
        {Number(order.discountAmount) > 0 ? (
          <div className="flex justify-between gap-3 text-electric-violet">
            <span>
              {t("discount")}
              {order.discountCode ? ` (${order.discountCode})` : ""}
            </span>
            <span className="text-end shrink-0">-EGP {Number(order.discountAmount).toLocaleString()}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 border-t border-warm-white/10 pt-2 text-base text-warm-white">
          <span>{t("total")}</span>
          <span className="text-end text-gold">
            EGP {Number(order.total).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-warm-white/10 pt-6 text-sm text-warm-white/60">
        <p className="text-xs uppercase tracking-[0.1em] text-warm-white/50">
          {t("deliveryAddress")}
        </p>
        <p className="mt-2">
          {address.name} · {address.phone}
          <br />
          {address.street}, {address.building}
          {address.floor ? `, ${address.floor}` : ""}
          {address.apartment ? `, ${address.apartment}` : ""}
          <br />
          {address.city}, {address.governorate}
        </p>
      </div>

      <div className="mt-6 border-t border-warm-white/10 pt-6 text-sm text-warm-white/60">
        <p className="text-xs uppercase tracking-[0.1em] text-warm-white/50">
          {t("paymentMethod")}
        </p>
        <p className="mt-2">{t(PAYMENT_KEYS[order.paymentMethod])}</p>
        {order.paymentMethod !== "COD" ? (
          <p className="mt-2 text-xs text-warm-white/45">
            {t("manualPaymentNote")}
          </p>
        ) : null}
      </div>

      <div className="mt-10 border-t border-warm-white/10 pt-8">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-warm-white px-6 py-3.5 text-center text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90"
        >
          {t("whatsappCta")}
        </a>
        <p className="mt-2 text-center text-xs text-warm-white/40">
          {t("whatsappHint")}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/track-order"
          className="border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
        >
          {t("trackOrder")}
        </Link>
        <Link
          href="/hoodies"
          className="px-2 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white/70 underline underline-offset-4 hover:text-warm-white"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
