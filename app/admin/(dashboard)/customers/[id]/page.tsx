import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: { createdAt: "desc" } },
      orders: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders.reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/customers"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← All Customers
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold text-soft-black">
          {customer.name}
        </h1>
        <span className="text-xs text-soft-black/45">
          Customer since{" "}
          {customer.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Contact</h2>
          <p className="mt-3 text-sm text-soft-black/70">{customer.phone}</p>
          {customer.email ? (
            <p className="text-sm text-soft-black/70">{customer.email}</p>
          ) : null}

          <div className="mt-5 flex gap-6 border-t border-soft-black/10 pt-4">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-soft-black/45">
                Orders
              </p>
              <p className="mt-1 text-lg font-semibold text-soft-black">
                {customer.orders.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-soft-black/45">
                Total Spent
              </p>
              <p className="mt-1 text-lg font-semibold text-soft-black">
                EGP {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">
            Addresses
          </h2>
          {customer.addresses.length === 0 ? (
            <p className="mt-3 text-sm text-soft-black/50">
              No saved addresses yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm text-soft-black/70">
              {customer.addresses.map((address) => (
                <li
                  key={address.id}
                  className="border-t border-soft-black/5 pt-3 first:border-0 first:pt-0"
                >
                  {address.street}, {address.building}
                  {address.floor ? `, ${address.floor}` : ""}
                  {address.apartment ? `, ${address.apartment}` : ""}
                  <br />
                  {address.city}, {address.governorate}
                  {address.landmark ? (
                    <>
                      <br />
                      Landmark: {address.landmark}
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-soft-black/10 bg-white">
        <h2 className="px-5 pt-5 text-sm font-semibold text-soft-black">
          Order History
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-soft-black/5 last:border-0 hover:bg-soft-black/[0.03]"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-soft-black hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-soft-black/70">
                    EGP {Number(order.total).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-soft-black/70">
                    {order.status.replaceAll("_", " ")}
                  </td>
                  <td className="px-5 py-3 text-xs text-soft-black/45">
                    {order.createdAt.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customer.orders.length === 0 ? (
            <p className="p-5 text-sm text-soft-black/50">No orders yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
