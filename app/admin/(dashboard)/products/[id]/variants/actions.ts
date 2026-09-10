"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { saveUploadedImage } from "@/lib/uploads";
import type { ImageRole } from "@/generated/prisma/enums";

async function getOrCreateOption(productId: string, name: "Color" | "Size") {
  const existing = await prisma.productOption.findFirst({
    where: { productId, name },
  });
  if (existing) return existing;
  return prisma.productOption.create({
    data: { productId, name, sortOrder: name === "Color" ? 0 : 1 },
  });
}

async function regenerateVariants(productId: string) {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    include: {
      options: { include: { values: true } },
    },
  });

  const colorOption = product.options.find((o) => o.name === "Color");
  const sizeOption = product.options.find((o) => o.name === "Size");
  if (!colorOption || !sizeOption) return;
  if (colorOption.values.length === 0 || sizeOption.values.length === 0) return;

  const existingVariants = await prisma.productVariant.findMany({
    where: { productId },
    include: { optionValues: true },
  });

  const skuBase = slugify(product.name).toUpperCase();

  for (const color of colorOption.values) {
    for (const size of sizeOption.values) {
      const alreadyExists = existingVariants.some((variant) => {
        const ids = variant.optionValues.map((v) => v.id);
        return ids.includes(color.id) && ids.includes(size.id);
      });
      if (alreadyExists) continue;

      const sku = `${skuBase}-${slugify(color.value).toUpperCase()}-${slugify(size.value).toUpperCase()}`;
      await prisma.productVariant.create({
        data: {
          productId,
          sku,
          optionValues: { connect: [{ id: color.id }, { id: size.id }] },
          inventory: { create: { quantity: 0 } },
        },
      });
    }
  }

  revalidatePath(`/admin/products/${productId}/variants`);
}

export async function addColor(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const swatchHex = String(formData.get("swatchHex") ?? "").trim() || null;
  if (!name) throw new Error("Color name is required.");

  const option = await getOrCreateOption(productId, "Color");

  const existing = await prisma.productOptionValue.findFirst({
    where: { optionId: option.id, value: name },
  });
  if (!existing) {
    const count = await prisma.productOptionValue.count({
      where: { optionId: option.id },
    });
    await prisma.productOptionValue.create({
      data: { optionId: option.id, value: name, swatchHex, sortOrder: count },
    });
  }

  await regenerateVariants(productId);
  revalidatePath(`/admin/products/${productId}/variants`);
}

export async function addSize(productId: string, formData: FormData) {
  const value = String(formData.get("value") ?? "").trim();
  if (!value) throw new Error("Size is required.");

  const option = await getOrCreateOption(productId, "Size");

  const existing = await prisma.productOptionValue.findFirst({
    where: { optionId: option.id, value },
  });
  if (!existing) {
    const count = await prisma.productOptionValue.count({
      where: { optionId: option.id },
    });
    await prisma.productOptionValue.create({
      data: { optionId: option.id, value, sortOrder: count },
    });
  }

  await regenerateVariants(productId);
  revalidatePath(`/admin/products/${productId}/variants`);
}

// First upload for a color becomes the Front shot, second the Back, the
// rest Detail — picking a role for every single file was the main friction
// point, so order-of-selection now does that job automatically.
const AUTO_ROLE_ORDER: ImageRole[] = ["FRONT", "BACK", "DETAIL"];

export async function uploadColorImage(
  productId: string,
  colorOptionValueId: string,
  formData: FormData,
) {
  const files = formData.getAll("file").filter(
    (f): f is File => f instanceof File && f.size > 0,
  );
  if (files.length === 0) {
    throw new Error("Choose at least one file to upload.");
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });
  const colorValue = await prisma.productOptionValue.findUniqueOrThrow({
    where: { id: colorOptionValueId },
  });

  let sortOrder = await prisma.productImage.count({
    where: { productId, colorOptionValueId },
  });

  for (const file of files) {
    const url = await saveUploadedImage(
      file,
      `products/${product.slug}/${slugify(colorValue.value)}`,
    );

    const role =
      AUTO_ROLE_ORDER[sortOrder] ?? AUTO_ROLE_ORDER[AUTO_ROLE_ORDER.length - 1];

    await prisma.productImage.create({
      data: {
        productId,
        colorOptionValueId,
        url,
        role,
        sortOrder,
        isPrimary: sortOrder === 0,
      },
    });
    sortOrder += 1;
  }

  revalidatePath(`/admin/products/${productId}/variants`);
}

export async function deleteImage(imageId: string, productId: string) {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });
  if (image) {
    await prisma.productImage.delete({ where: { id: imageId } });
    const filePath = path.join(process.cwd(), "public", image.url);
    await unlink(filePath).catch(() => {});
  }
  revalidatePath(`/admin/products/${productId}/variants`);
}

export async function updateInventory(productId: string, formData: FormData) {
  const updates: Promise<unknown>[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("qty-")) continue;
    const variantId = key.slice(4);
    const quantity = Math.max(0, Number(value) || 0);
    updates.push(
      prisma.inventory.update({
        where: { variantId },
        data: { quantity },
      }),
    );
  }
  await Promise.all(updates);
  revalidatePath(`/admin/products/${productId}/variants`);
}
