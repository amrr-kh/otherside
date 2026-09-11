import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put, del } from "@vercel/blob";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

/**
 * Saves an uploaded file and returns its public URL. Uses Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is configured (production) — Vercel's filesystem is
 * read-only at runtime, so writing to public/uploads there would silently
 * fail or vanish on the next deploy. Falls back to local disk when the
 * token isn't set, so local development needs no extra config.
 */
export async function saveUploadedImage(
  file: File,
  folder: string,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only PNG, JPEG, or WEBP images are allowed.");
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

/** Deletes a file saved by saveUploadedImage, whichever storage it's in. */
export async function deleteUploadedImage(url: string): Promise<void> {
  if (/^https?:\/\//.test(url)) {
    await del(url).catch(() => {});
    return;
  }
  const { unlink } = await import("node:fs/promises");
  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => {});
}
