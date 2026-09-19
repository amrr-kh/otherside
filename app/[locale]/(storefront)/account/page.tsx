import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo-pages";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCustomerSession } from "@/lib/customer-session";
import { logOut } from "@/lib/actions/account";
import { prisma } from "@/lib/db";
import { AccountAuthForms } from "@/components/storefront/account/AccountAuthForms";
import { AddressBook } from "@/components/storefront/account/AddressBook";
import { getActiveShippingZones } from "@/lib/storefront/shipping";
import { isGoogleAuthConfigured } from "@/lib/google-oauth";

export const revalidate = 0;

const STATUS_KEYS: Record<string, string> = {
  RECEIVED: "statusReceived",
  CONFIRMED: "statusConfirmed",
  PREPARING: "statusPreparing",
  SHIPPED: "statusShipped",
  OUT_FOR_DELIVERY: "statusOutForDelivery",
  DELIVERED: "statusDelivered",
  CANCELLED: "statusCancelled",
  RETURNED: "statusReturned",
};

export default async function AccountPage({
  searchParams,
}: PageProps<"/[locale]/account">) {
  const sp = await searchParams;
  const authError = typeof sp.authError === "string" ? sp.authError : undefined;
  const forms = (
    <AccountAuthForms
      googleEnabled={isGoogleAuthConfigured()}
      authError={authError}
    />
  );

  const session = await getCustomerSession();
  if (!session) return forms;

  const [t, tStatus, zones] = await Promise.all([
    getTranslations("account"),
    getTranslations("trackOrder"),
    getActiveShippingZones(),
  ]);

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
      addresses: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!customer) return forms;

  const governorates = zones
    .flatMap((zone) => zone.governorates)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl italic text-warm-white">
            {t("welcome", { name: customer.name })}
          </h1>
        </div>
        <form action={logOut}>
          <button
            type="submit"
            className="border border-warm-white/40 px-5 py-2.5 text-xs uppercase tracking-[0.1em] text-warm-white/70 hover:border-warm-white hover:text-warm-white"
          >
            {t("logOut")}
          </button>
        </form>
      </div>

      <div className="mt-10 border-t border-warm-white/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
          {t("yourDetails")}
        </h2>
        <div className="mt-3 space-y-1 text-sm text-warm-white/60">
          {customer.phone ? (
            <p dir="ltr" className="inline-block">
              {customer.phone}
            </p>
          ) : (
            <p className="text-warm-white/45">{t("phoneMissing")}</p>
          )}
          {customer.email ? <p dir="ltr">{customer.email}</p> : null}
        </div>
      </div>

      <div className="mt-10 border-t border-warm-white/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
          {t("orderHistory")}
        </h2>
        {customer.orders.length === 0 ? (
          <p className="mt-3 text-sm text-warm-white/45">{t("noOrders")}</p>
        ) : (
          <div className="mt-4 divide-y divide-warm-white/10 border-y border-warm-white/10">
            {customer.orders.map((order) => {
              const [firstItem, ...otherItems] = order.items;
              return (
                <Link
                  key={order.id}
                  href={`/order-confirmation/${order.orderNumber}`}
                  className="flex items-start justify-between gap-4 py-4 hover:bg-warm-white/[0.03]"
                >
                  <div className="min-w-0">
                    <span
                      className="font-display text-sm italic text-warm-white"
                      dir="ltr"
                    >
                      {order.orderNumber}
                    </span>
                    <p className="mt-0.5 text-xs text-warm-white/40">
                      {order.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {tStatus(STATUS_KEYS[order.status] ?? "statusReceived")}
                    </p>
                    {firstItem ? (
                      <p className="mt-1 text-xs text-warm-white/55">
                        {firstItem.productNameSnapshot} ({firstItem.colorSnapshot}
                        /{firstItem.sizeSnapshot}) × {firstItem.quantity}
                        {otherItems.length > 0
                          ? ` ${t("orderMore", { count: otherItems.length })}`
                          : ""}
                      </p>
                    ) : null}
                    {order.trackingNumber ? (
                      <p className="mt-1 text-xs text-warm-white/40" dir="ltr">
                        {t("trackingNumber", { number: order.trackingNumber })}
                      </p>
                    ) : null}
                  </div>
                  <span className="whitespace-nowrap text-sm text-gold">
                    EGP {Number(order.total).toLocaleString()}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-warm-white/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
          {t("savedAddresses")}
        </h2>
        <p className="mt-1 text-xs text-warm-white/40">{t("addressesIntro")}</p>
        <AddressBook
          addresses={customer.addresses.map((address) => ({
            id: address.id,
            governorate: address.governorate,
            city: address.city,
            street: address.street,
            building: address.building,
            floor: address.floor,
            apartment: address.apartment,
            landmark: address.landmark,
          }))}
          governorates={governorates}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/account">): Promise<Metadata> {
  const { locale } = await params;
  return privatePageMetadata(locale, "account");
}
