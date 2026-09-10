import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { createCollection, deleteCollection } from "./actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-soft-black">Collections</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Group products together for curated storefront pages like &ldquo;New
        Drop&rdquo; or a seasonal capsule.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex items-center gap-4 rounded-lg border border-soft-black/10 bg-white p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-soft-black/5">
              {collection.image ? (
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <Link
                href={`/admin/collections/${collection.id}`}
                className="font-medium text-soft-black hover:underline"
              >
                {collection.name}
              </Link>
              {collection.isNewDrop ? (
                <span className="ml-2 rounded bg-electric-violet/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-electric-violet">
                  New Drop
                </span>
              ) : null}
              <p className="mt-0.5 text-xs text-soft-black/45">
                /{collection.slug} · {collection._count.products} product
                {collection._count.products === 1 ? "" : "s"}
              </p>
            </div>
            <form action={deleteCollection.bind(null, collection.id)}>
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
              >
                Delete
              </button>
            </form>
          </div>
        ))}

        {collections.length === 0 ? (
          <p className="text-sm text-soft-black/50">
            No collections yet — add one below.
          </p>
        ) : null}
      </div>

      <div className="mt-10 rounded-lg border border-soft-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold text-soft-black">
          Add Collection
        </h2>
        <form action={createCollection} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. The Veil Study"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Description (optional)
            </label>
            <textarea name="description" rows={2} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-soft-black/70">
            <input
              type="checkbox"
              name="isNewDrop"
              className="accent-electric-violet"
            />
            Feature as the homepage &ldquo;New Drop&rdquo;
          </label>
          <button
            type="submit"
            className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
          >
            Create Collection
          </button>
        </form>
      </div>
    </div>
  );
}
