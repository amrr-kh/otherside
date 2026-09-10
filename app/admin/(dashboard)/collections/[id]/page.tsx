import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AutoSubmitFileInput } from "@/components/admin/AutoSubmitFileInput";
import {
  updateCollection,
  uploadCollectionImage,
  toggleProductInCollection,
} from "../actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function AdminCollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [collection, allProducts] = await Promise.all([
    prisma.collection.findUnique({
      where: { id },
      include: { products: { select: { id: true } } },
    }),
    prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, status: true },
    }),
  ]);

  if (!collection) notFound();

  const includedIds = new Set(collection.products.map((p) => p.id));

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/collections"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← All Collections
      </Link>

      <h1 className="mt-3 text-xl font-semibold text-soft-black">
        {collection.name}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Details</h2>
          <form
            action={updateCollection.bind(null, collection.id)}
            className="mt-4 flex flex-col gap-4"
          >
            <div>
              <label className="mb-1 block text-xs text-soft-black/50">
                Name
              </label>
              <input
                name="name"
                required
                defaultValue={collection.name}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-soft-black/50">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={collection.description ?? ""}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-soft-black/70">
              <input
                type="checkbox"
                name="isNewDrop"
                defaultChecked={collection.isNewDrop}
                className="accent-electric-violet"
              />
              Feature as the homepage &ldquo;New Drop&rdquo;
            </label>
            <button
              type="submit"
              className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
            >
              Save
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Image</h2>
          <div className="relative mt-3 aspect-square w-full overflow-hidden rounded bg-soft-black/5">
            {collection.image ? (
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="300px"
                className="object-cover"
              />
            ) : null}
          </div>
          <form
            action={uploadCollectionImage.bind(null, collection.id)}
            className="mt-3"
          >
            <AutoSubmitFileInput
              name="image"
              accept="image/png,image/jpeg,image/webp"
              className="w-full text-xs text-soft-black/70"
            />
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">Products</h2>
        <p className="mt-1 text-xs text-soft-black/50">
          Toggle which products belong to this collection.
        </p>
        <div className="mt-4 flex flex-col divide-y divide-soft-black/5">
          {allProducts.map((product) => {
            const included = includedIds.has(product.id);
            return (
              <form
                key={product.id}
                action={toggleProductInCollection.bind(
                  null,
                  collection.id,
                  product.id,
                  !included,
                )}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="text-sm text-soft-black/80">
                  {product.name}
                  {product.status === "DRAFT" ? (
                    <span className="ml-2 text-xs text-soft-black/40">
                      (draft)
                    </span>
                  ) : null}
                </span>
                <button
                  type="submit"
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    included
                      ? "bg-electric-violet/15 text-electric-violet"
                      : "bg-soft-black/10 text-soft-black/50"
                  }`}
                >
                  {included ? "Included" : "Add"}
                </button>
              </form>
            );
          })}
          {allProducts.length === 0 ? (
            <p className="py-2.5 text-sm text-soft-black/50">
              No products yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
