"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/slug";
import { saveUploadedImage } from "@/lib/uploads";

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "collection";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.collection.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createCollection(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isNewDrop = formData.get("isNewDrop") === "on";

  if (!name) throw new Error("Collection name is required.");

  const slug = await uniqueSlug(name);
  const collection = await prisma.collection.create({
    data: { name, slug, description: description || null, isNewDrop },
  });

  revalidatePath("/admin/collections");
  redirect(`/admin/collections/${collection.id}`);
}

export async function updateCollection(collectionId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isNewDrop = formData.get("isNewDrop") === "on";

  if (!name) throw new Error("Collection name is required.");

  const slug = await uniqueSlug(name, collectionId);

  await prisma.collection.update({
    where: { id: collectionId },
    data: { name, slug, description: description || null, isNewDrop },
  });

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
}

export async function uploadCollectionImage(
  collectionId: string,
  formData: FormData,
) {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No image selected.");
  }

  const url = await saveUploadedImage(file, `collections/${collectionId}`);
  await prisma.collection.update({
    where: { id: collectionId },
    data: { image: url },
  });

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/admin/collections");
}

export async function toggleProductInCollection(
  collectionId: string,
  productId: string,
  included: boolean,
) {
  await requireAdmin();

  await prisma.collection.update({
    where: { id: collectionId },
    data: {
      products: included
        ? { connect: { id: productId } }
        : { disconnect: { id: productId } },
    },
  });

  revalidatePath(`/admin/collections/${collectionId}`);
}

export async function deleteCollection(collectionId: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id: collectionId } });
  revalidatePath("/admin/collections");
}
