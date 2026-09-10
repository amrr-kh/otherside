import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← Back to Products
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-soft-black">
        Add Product
      </h1>

      <div className="mt-8">
        <ProductForm action={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  );
}
