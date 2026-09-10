import { prisma } from "@/lib/db";

async function getStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [activeProducts, totalOrders, ordersToday] = await Promise.all([
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  return { activeProducts, totalOrders, ordersToday };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const tiles = [
    { label: "Active Products", value: stats.activeProducts },
    { label: "Orders Today", value: stats.ordersToday },
    { label: "Total Orders", value: stats.totalOrders },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-soft-black">Dashboard</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Welcome back. This view grows with each phase — products, orders,
        and low-stock alerts will populate here as they go live.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border border-soft-black/10 bg-white px-6 py-5"
          >
            <p className="text-xs uppercase tracking-[0.1em] text-soft-black/45">
              {tile.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-soft-black">
              {tile.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
