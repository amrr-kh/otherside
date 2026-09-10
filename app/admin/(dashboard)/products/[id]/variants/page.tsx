import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AutoSubmitFileInput } from "@/components/admin/AutoSubmitFileInput";
import {
  addColor,
  addSize,
  uploadColorImage,
  deleteImage,
  updateInventory,
} from "./actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function ProductVariantsPage({
  params,
}: PageProps<"/admin/products/[id]/variants">) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      options: { include: { values: true }, orderBy: { sortOrder: "asc" } },
      images: { orderBy: [{ colorOptionValueId: "asc" }, { sortOrder: "asc" }] },
      variants: {
        include: { optionValues: true, inventory: true },
      },
    },
  });

  if (!product) notFound();

  const colorOption = product.options.find((o) => o.name === "Color");
  const sizeOption = product.options.find((o) => o.name === "Size");
  const colors = colorOption?.values ?? [];
  const sizes = sizeOption?.values ?? [];

  function variantFor(colorId: string, sizeId: string) {
    return product!.variants.find((v) => {
      const ids = v.optionValues.map((o) => o.id);
      return ids.includes(colorId) && ids.includes(sizeId);
    });
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/products"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← Back to Products
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-soft-black">
        {product.name} — Colors, Sizes & Stock
      </h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Add every color and size this product comes in. Combinations (e.g.
        Black / M) are created automatically, and stock starts at 0 until you
        set it below.
      </p>

      {/* Sizes */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-soft-black/70">
          Sizes
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {sizes.map((size) => (
            <span
              key={size.id}
              className="rounded border border-soft-black/15 bg-white px-3 py-1.5 text-sm"
            >
              {size.value}
            </span>
          ))}
          <form action={addSize.bind(null, product.id)} className="flex gap-2">
            <input
              name="value"
              placeholder="e.g. M"
              required
              className={`${inputClass} w-24`}
            />
            <button
              type="submit"
              className="rounded border border-soft-black/20 px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
            >
              Add Size
            </button>
          </form>
        </div>
      </section>

      {/* Colors */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-soft-black/70">
          Colors & Photos
        </h2>

        <form
          action={addColor.bind(null, product.id)}
          className="mt-3 flex flex-wrap items-end gap-2"
        >
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Color name
            </label>
            <input name="name" placeholder="e.g. Burgundy" required className={`${inputClass} w-40`} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Swatch hex (optional)
            </label>
            <input name="swatchHex" placeholder="#4a1d2c" className={`${inputClass} w-32`} />
          </div>
          <button
            type="submit"
            className="rounded border border-soft-black/20 px-3 py-2 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
          >
            Add Color
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-6">
          {colors.map((color) => {
            const images = product.images.filter(
              (img) => img.colorOptionValueId === color.id,
            );
            return (
              <div
                key={color.id}
                className="rounded-lg border border-soft-black/10 bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  {color.swatchHex ? (
                    <span
                      className="h-4 w-4 rounded-full border border-soft-black/20"
                      style={{ backgroundColor: color.swatchHex }}
                    />
                  ) : null}
                  <h3 className="text-sm font-semibold text-soft-black">
                    {color.value}
                  </h3>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative">
                      <Image
                        src={img.url}
                        alt={`${product.name} — ${color.value} — ${img.role}`}
                        width={96}
                        height={120}
                        className="h-30 w-24 rounded object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase text-white">
                        {img.role}
                        {img.modelGender ? ` · ${img.modelGender}` : ""}
                      </span>
                      <form
                        action={deleteImage.bind(null, img.id, product.id)}
                        className="absolute right-1 top-1"
                      >
                        <button
                          type="submit"
                          className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white hover:bg-black/80"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  ))}
                </div>

                <form
                  action={uploadColorImage.bind(null, product.id, color.id)}
                  className="mt-4 flex flex-wrap items-center gap-3"
                >
                  <div>
                    <label className="mb-1 block text-xs text-soft-black/50">
                      Photos are for
                    </label>
                    <select name="modelGender" defaultValue="" className={`${inputClass} w-36`}>
                      <option value="">Unisex / Shared</option>
                      <option value="MEN">Men</option>
                      <option value="WOMEN">Women</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-soft-black/50">
                      Photos
                    </label>
                    <AutoSubmitFileInput
                      name="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="text-xs"
                    />
                  </div>
                  <span className="w-full text-xs text-soft-black/40">
                    Choosing a file uploads it right away — first becomes
                    Front, second Back, rest Detail (per Unisex/Men/Women set).
                    No extra click needed.
                  </span>
                </form>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inventory grid */}
      {colors.length > 0 && sizes.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-soft-black/70">
            Stock
          </h2>
          <form action={updateInventory.bind(null, product.id)} className="mt-3">
            <div className="overflow-x-auto rounded-lg border border-soft-black/10 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-soft-black/10 text-xs uppercase tracking-[0.08em] text-soft-black/45">
                    <th className="px-4 py-3 font-medium">Color</th>
                    {sizes.map((size) => (
                      <th key={size.id} className="px-4 py-3 font-medium">
                        {size.value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colors.map((color) => (
                    <tr
                      key={color.id}
                      className="border-b border-soft-black/5 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-soft-black">
                        {color.value}
                      </td>
                      {sizes.map((size) => {
                        const variant = variantFor(color.id, size.id);
                        return (
                          <td key={size.id} className="px-4 py-3">
                            {variant ? (
                              <input
                                type="number"
                                min={0}
                                name={`qty-${variant.id}`}
                                defaultValue={variant.inventory?.quantity ?? 0}
                                className={`${inputClass} w-20`}
                              />
                            ) : (
                              <span className="text-soft-black/30">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              className="mt-4 bg-soft-black px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
            >
              Save Stock
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
