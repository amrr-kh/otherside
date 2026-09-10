import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

/**
 * Saves an uploaded file under public/uploads so it's servable by Next.js
 * at the returned URL. Local-disk only — Vercel's filesystem is read-only
 * at runtime, so this must move to a real blob store (e.g. Vercel Blob)
 * before deploying. Fine for local development in the meantime.
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
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}
