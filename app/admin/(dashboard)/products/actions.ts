"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { ProductGender, ProductStatus } from "@/generated/prisma/enums";

async function uniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "product";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function resolveCategoryId(categoryName: FormDataEntryValue | null) {
  const name = typeof categoryName === "string" ? categoryName.trim() : "";
  if (!name) return null;

  const slug = slugify(name);
  const category = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
  return category.id;
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const fullDescription = String(formData.get("fullDescription") ?? "").trim();
  const basePrice = Number(formData.get("basePrice"));
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const compareAtPrice =
    typeof compareAtPriceRaw === "string" && compareAtPriceRaw.trim() !== ""
      ? Number(compareAtPriceRaw)
      : null;
  const gender = String(formData.get("gender") ?? "UNISEX") as ProductGender;
  const status = String(formData.get("status") ?? "DRAFT") as ProductStatus;
  const material = String(formData.get("material") ?? "").trim() || null;
  const fit = String(formData.get("fit") ?? "").trim() || null;
  const care = String(formData.get("care") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const isNewDrop = formData.get("isNewDrop") === "on";
  const trending = formData.get("trending") === "on";

  if (!name) throw new Error("Product name is required.");
  if (!shortDescription) throw new Error("Short description is required.");
  if (!fullDescription) throw new Error("Full description is required.");
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }

  return {
    name,
    shortDescription,
    fullDescription,
    basePrice,
    compareAtPrice,
    gender,
    status,
    material,
    fit,
    care,
    featured,
    isNewDrop,
    trending,
  };
}

export async function createProduct(formData: FormData) {
  const fields = readProductFields(formData);
  const categoryId = await resolveCategoryId(formData.get("category"));
  const slug = await uniqueSlug(fields.name);

  await prisma.product.create({
    data: { ...fields, slug, categoryId },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const fields = readProductFields(formData);
  const categoryId = await resolveCategoryId(formData.get("category"));
  const slug = await uniqueSlug(fields.name, productId);

  await prisma.product.update({
    where: { id: productId },
    data: { ...fields, slug, categoryId },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function setProductStatus(
  productId: string,
  status: ProductStatus,
) {
  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });
  revalidatePath("/admin/products");
}

export async function deleteProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, variants: { select: { id: true } } },
  });
  if (!product) return;

  const variantIds = product.variants.map((v) => v.id);
  if (variantIds.length > 0) {
    await prisma.cartItem.deleteMany({
      where: { variantId: { in: variantIds } },
    });
  }

  await prisma.product.delete({ where: { id: productId } });

  await Promise.all(
    product.images.map((image) =>
      unlink(path.join(process.cwd(), "public", image.url)).catch(() => {}),
    ),
  );

  revalidatePath("/admin/products");
}
