import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← Back to Products
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-soft-black">
        Edit {product.name}
      </h1>

      <div className="mt-8">
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          submitLabel="Save Changes"
          defaultValues={{
            name: product.name,
            shortDescription: product.shortDescription,
            fullDescription: product.fullDescription,
            basePrice: Number(product.basePrice),
            compareAtPrice: product.compareAtPrice
              ? Number(product.compareAtPrice)
              : null,
            categoryName: product.category?.name ?? "",
            gender: product.gender,
            status: product.status,
            material: product.material ?? "",
            fit: product.fit ?? "",
            care: product.care ?? "",
            featured: product.featured,
            isNewDrop: product.isNewDrop,
            trending: product.trending,
          }}
        />
      </div>
    </div>
  );
}
