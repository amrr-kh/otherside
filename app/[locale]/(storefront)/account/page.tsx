import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCustomerSession } from "@/lib/customer-session";
import { logOut } from "@/lib/actions/account";
import { prisma } from "@/lib/db";
import { AccountAuthForms } from "@/components/storefront/account/AccountAuthForms";

export const revalidate = 0;

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) return <AccountAuthForms />;

  const t = await getTranslations("account");

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
      addresses: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!customer) return <AccountAuthForms />;

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

      <div className="mt-10 border-t border-warm-white/10 pt-6 text-sm text-warm-white/60">
        <p dir="ltr" className="inline-block">
          {customer.phone}
        </p>
        {customer.email ? <p>{customer.email}</p> : null}
      </div>

      <div className="mt-10 border-t border-warm-white/10 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
          {t("orderHistory")}
        </h2>
        {customer.orders.length === 0 ? (
          <p className="mt-3 text-sm text-warm-white/45">{t("noOrders")}</p>
        ) : (
          <div className="mt-4 divide-y divide-warm-white/10 border-y border-warm-white/10">
            {customer.orders.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 py-4 hover:bg-warm-white/[0.03]"
              >
                <div>
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
                    · {order.status.replaceAll("_", " ")}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm text-gold">
                  EGP {Number(order.total).toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {customer.addresses.length > 0 ? (
        <div className="mt-10 border-t border-warm-white/10 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
            {t("savedAddresses")}
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {customer.addresses.map((address) => (
              <p key={address.id} className="text-sm text-warm-white/60">
                {address.street}, {address.building}
                {address.floor ? `, ${address.floor}` : ""}
                {address.apartment ? `, ${address.apartment}` : ""}
                <br />
                {address.city}, {address.governorate}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
