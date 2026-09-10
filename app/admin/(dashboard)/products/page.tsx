import Link from "next/link";
import { prisma } from "@/lib/db";
import { setProductStatus, deleteProduct } from "./actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-soft-black/10 text-soft-black/60",
  ACTIVE: "bg-electric-violet/15 text-electric-violet",
  ARCHIVED: "bg-orange/15 text-orange",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-soft-black">Products</h1>
          <p className="mt-1 text-sm text-soft-black/50">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-soft-black/50">
          No products yet. Click &ldquo;Add Product&rdquo; to create the
          first one.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-soft-black/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-soft-black/5 last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-soft-black">
                    {product.name}
                  </td>
                  <td className="px-5 py-3.5 text-soft-black/60">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-soft-black/60">
                    EGP {Number(product.basePrice).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${STATUS_STYLES[product.status]}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-soft-black/45">
                    {product.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs uppercase tracking-[0.1em] text-electric-violet hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/variants`}
                        className="text-xs uppercase tracking-[0.1em] text-electric-violet hover:underline"
                      >
                        Colors & Stock
                      </Link>
                      {product.status !== "ARCHIVED" ? (
                        <form
                          action={setProductStatus.bind(
                            null,
                            product.id,
                            "ARCHIVED",
                          )}
                        >
                          <button
                            type="submit"
                            className="text-xs uppercase tracking-[0.1em] text-soft-black/40 hover:text-soft-black"
                          >
                            Archive
                          </button>
                        </form>
                      ) : (
                        <form
                          action={setProductStatus.bind(
                            null,
                            product.id,
                            "ACTIVE",
                          )}
                        >
                          <button
                            type="submit"
                            className="text-xs uppercase tracking-[0.1em] text-soft-black/40 hover:text-soft-black"
                          >
                            Restore
                          </button>
                        </form>
                      )}
                      <DeleteProductButton
                        action={deleteProduct.bind(null, product.id)}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
