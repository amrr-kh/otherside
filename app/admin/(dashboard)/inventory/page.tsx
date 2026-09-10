import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ low?: string }>;
}) {
  const sp = await searchParams;
  const lowOnly = sp.low === "1";

  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    include: {
      product: { select: { id: true, name: true } },
      optionValues: { include: { option: true } },
      inventory: true,
    },
    orderBy: { product: { name: "asc" } },
  });

  const rows = variants
    .map((v) => {
      const color = v.optionValues.find((ov) => ov.option.name === "Color")?.value ?? "—";
      const size = v.optionValues.find((ov) => ov.option.name === "Size")?.value ?? "—";
      const quantity = v.inventory?.quantity ?? 0;
      const lowStockThreshold = v.inventory?.lowStockThreshold ?? 3;
      return {
        id: v.id,
        productId: v.product.id,
        productName: v.product.name,
        color,
        size,
        quantity,
        isLow: quantity <= lowStockThreshold,
      };
    })
    .sort((a, b) => a.quantity - b.quantity);

  const visibleRows = lowOnly ? rows.filter((r) => r.isLow) : rows;
  const lowCount = rows.filter((r) => r.isLow).length;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-soft-black">Inventory</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Every color/size combination across all products, lowest stock
        first. {lowCount} at or below its low-stock threshold.
      </p>

      <div className="mt-4 flex gap-2 text-xs">
        <Link
          href="/admin/inventory"
          className={`rounded px-3 py-1.5 font-medium uppercase tracking-[0.08em] ${
            !lowOnly
              ? "bg-soft-black text-warm-white"
              : "border border-soft-black/20 text-soft-black/60 hover:bg-soft-black/5"
          }`}
        >
          All ({rows.length})
        </Link>
        <Link
          href="/admin/inventory?low=1"
          className={`rounded px-3 py-1.5 font-medium uppercase tracking-[0.08em] ${
            lowOnly
              ? "bg-magenta text-warm-white"
              : "border border-soft-black/20 text-soft-black/60 hover:bg-soft-black/5"
          }`}
        >
          Low Stock ({lowCount})
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-soft-black/10 bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Color</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-soft-black/5 last:border-0 ${row.isLow ? "bg-magenta/5" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-soft-black">
                  {row.productName}
                </td>
                <td className="px-4 py-3 text-soft-black/70">{row.color}</td>
                <td className="px-4 py-3 text-soft-black/70">{row.size}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.isLow
                        ? "font-medium text-magenta"
                        : "text-soft-black/70"
                    }
                  >
                    {row.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${row.productId}/variants`}
                    className="text-xs uppercase tracking-[0.1em] text-electric-violet hover:underline"
                  >
                    Edit Stock
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleRows.length === 0 ? (
          <p className="p-6 text-sm text-soft-black/50">
            {lowOnly
              ? "Nothing is low on stock right now."
              : "No active variants yet."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
