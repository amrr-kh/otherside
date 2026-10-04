"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function removeSubscriber(subscriberId: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id: subscriberId } });
  revalidatePath("/admin/newsletter");
}
