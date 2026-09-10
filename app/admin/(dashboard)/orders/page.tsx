import Link from "next/link";
import { prisma } from "@/lib/db";

const STATUS_STYLES: Record<string, string> = {
  RECEIVED: "bg-soft-black/10 text-soft-black/70",
  CONFIRMED: "bg-electric-violet/15 text-electric-violet",
  PREPARING: "bg-electric-violet/15 text-electric-violet",
  SHIPPED: "bg-gold/20 text-gold",
  OUT_FOR_DELIVERY: "bg-gold/20 text-gold",
  DELIVERED: "bg-green-600/15 text-green-700",
  CANCELLED: "bg-magenta/15 text-magenta",
  RETURNED: "bg-magenta/15 text-magenta",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { customer: true },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-soft-black">Orders</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        {orders.length} order{orders.length === 1 ? "" : "s"}, most recent
        first.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-soft-black/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-soft-black/5 last:border-0 hover:bg-soft-black/[0.03]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-soft-black hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-soft-black/70">
                  {order.customer.name}
                  <span className="block text-xs text-soft-black/40">
                    {order.customer.phone}
                  </span>
                </td>
                <td className="px-4 py-3 text-soft-black/70">
                  EGP {Number(order.total).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-soft-black/70">
                  {order.paymentMethod}
                  {order.paymentMethod !== "COD" && !order.paymentConfirmed ? (
                    <span className="ml-2 rounded bg-magenta/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-magenta">
                      Unconfirmed
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-soft-black/10 text-soft-black/70"}`}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-soft-black/45">
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

        {orders.length === 0 ? (
          <p className="p-6 text-sm text-soft-black/50">
            No orders yet — they&apos;ll show up here as soon as someone
            checks out.
          </p>
        ) : null}
      </div>
    </div>
  );
}
