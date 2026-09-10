import { prisma } from "@/lib/db";

const EXCLUDED_FROM_REVENUE = new Set(["CANCELLED", "RETURNED"]);

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Received",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  INSTAPAY: "InstaPay",
  MOBILE_WALLET: "Mobile Wallet",
};

// Local calendar-date key — toISOString() would convert through UTC first,
// silently shifting the date across the boundary depending on server
// timezone, which broke matching orders to the right day.
function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Bar({
  label,
  value,
  max,
  displayValue,
}: {
  label: string;
  value: number;
  max: number;
  displayValue?: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 truncate text-soft-black/60">{label}</span>
      <div className="h-5 flex-1 rounded bg-soft-black/5">
        <div
          className="h-full rounded bg-electric-violet/70"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-24 shrink-0 text-right text-soft-black/70">
        {displayValue ?? value.toLocaleString()}
      </span>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [orders, customerCount] = await Promise.all([
    prisma.order.findMany({
      select: {
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        items: {
          select: { productNameSnapshot: true, quantity: true, unitPrice: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.customer.count(),
  ]);

  const validOrders = orders.filter((o) => !EXCLUDED_FROM_REVENUE.has(o.status));
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

  const statusCounts = new Map<string, number>();
  for (const o of orders) {
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);
  }

  const paymentCounts = new Map<string, number>();
  for (const o of orders) {
    paymentCounts.set(o.paymentMethod, (paymentCounts.get(o.paymentMethod) ?? 0) + 1);
  }

  const productStats = new Map<string, { quantity: number; revenue: number }>();
  for (const o of validOrders) {
    for (const item of o.items) {
      const entry = productStats.get(item.productNameSnapshot) ?? { quantity: 0, revenue: 0 };
      entry.quantity += item.quantity;
      entry.revenue += Number(item.unitPrice) * item.quantity;
      productStats.set(item.productNameSnapshot, entry);
    }
  }
  const topProducts = Array.from(productStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue for each of the last 14 days.
  const days: { label: string; date: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      date: localDateKey(d),
      revenue: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.date, i]));
  for (const o of validOrders) {
    const key = localDateKey(o.createdAt);
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].revenue += Number(o.total);
  }
  const maxDayRevenue = Math.max(...days.map((d) => d.revenue), 1);

  const maxStatusCount = Math.max(...Array.from(statusCounts.values()), 1);
  const maxPaymentCount = Math.max(...Array.from(paymentCounts.values()), 1);
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-soft-black">Analytics</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Computed from every order placed so far.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-soft-black/10 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
            Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-soft-black">
            EGP {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-soft-black/10 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
            Orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-soft-black">
            {totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-soft-black/10 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
            Avg Order Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-soft-black">
            EGP {Math.round(avgOrderValue).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-soft-black/10 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
            Customers
          </p>
          <p className="mt-2 text-2xl font-semibold text-soft-black">
            {customerCount}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">
          Revenue — Last 14 Days
        </h2>
        {totalRevenue === 0 ? (
          <p className="mt-3 text-sm text-soft-black/50">No revenue yet.</p>
        ) : (
          <div className="mt-4 flex gap-1.5" style={{ height: 140 }}>
            {days.map((d) => (
              <div
                key={d.date}
                className="group relative flex flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full rounded-sm bg-electric-violet/70"
                  style={{
                    height: `${Math.max((d.revenue / maxDayRevenue) * 100, d.revenue > 0 ? 3 : 0)}%`,
                  }}
                />
                <span className="pointer-events-none absolute -top-6 hidden whitespace-nowrap rounded bg-soft-black px-1.5 py-0.5 text-[10px] text-warm-white group-hover:block">
                  EGP {d.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex gap-1.5 text-[10px] text-soft-black/40">
          {days.map((d, i) => (
            <span key={d.date} className="flex-1 text-center">
              {i % 2 === 0 ? d.label : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">
            Orders by Status
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {orders.length === 0 ? (
              <p className="text-sm text-soft-black/50">No orders yet.</p>
            ) : (
              Array.from(statusCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <Bar
                    key={status}
                    label={STATUS_LABELS[status] ?? status}
                    value={count}
                    max={maxStatusCount}
                  />
                ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">
            Orders by Payment Method
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {orders.length === 0 ? (
              <p className="text-sm text-soft-black/50">No orders yet.</p>
            ) : (
              Array.from(paymentCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([method, count]) => (
                  <Bar
                    key={method}
                    label={PAYMENT_LABELS[method] ?? method}
                    value={count}
                    max={maxPaymentCount}
                  />
                ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">
          Top Products by Revenue
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {topProducts.length === 0 ? (
            <p className="text-sm text-soft-black/50">No sales yet.</p>
          ) : (
            topProducts.map((p) => (
              <Bar
                key={p.name}
                label={p.name}
                value={p.revenue}
                max={maxProductRevenue}
                displayValue={`EGP ${p.revenue.toLocaleString()}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
