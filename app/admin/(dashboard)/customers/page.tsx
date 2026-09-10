import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { orders: { select: { total: true, createdAt: true } } },
  });

  const rows = customers
    .map((customer) => {
      const orderCount = customer.orders.length;
      const totalSpent = customer.orders.reduce(
        (sum, o) => sum + Number(o.total),
        0,
      );
      const lastOrderAt = customer.orders.reduce<Date | null>(
        (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
        null,
      );
      return { customer, orderCount, totalSpent, lastOrderAt };
    })
    .sort((a, b) => {
      if (!a.lastOrderAt) return 1;
      if (!b.lastOrderAt) return -1;
      return b.lastOrderAt.getTime() - a.lastOrderAt.getTime();
    });

  return (
    <div>
      <h1 className="text-xl font-semibold text-soft-black">Customers</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        {customers.length} customer{customers.length === 1 ? "" : "s"}, most
        recent order first.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-soft-black/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3 font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ customer, orderCount, totalSpent, lastOrderAt }) => (
              <tr
                key={customer.id}
                className="border-b border-soft-black/5 last:border-0 hover:bg-soft-black/[0.03]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium text-soft-black hover:underline"
                  >
                    {customer.name}
                  </Link>
                  <span className="block text-xs text-soft-black/40">
                    {customer.phone}
                    {customer.email ? ` · ${customer.email}` : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-soft-black/70">{orderCount}</td>
                <td className="px-4 py-3 text-soft-black/70">
                  EGP {totalSpent.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-soft-black/45">
                  {lastOrderAt
                    ? lastOrderAt.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 ? (
          <p className="p-6 text-sm text-soft-black/50">
            No customers yet — they&apos;ll show up here as soon as someone
            checks out.
          </p>
        ) : null}
      </div>
    </div>
  );
}
