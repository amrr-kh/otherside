"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { OrderStatus } from "@/generated/prisma/enums";

const VALID_STATUSES: OrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "") as OrderStatus;
  const note = String(formData.get("note") ?? "").trim();

  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid order status.");
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status } }),
    prisma.orderStatusHistory.create({
      data: { orderId, status, note: note || null },
    }),
  ]);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function setTrackingNumber(orderId: string, formData: FormData) {
  await requireAdmin();
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  await prisma.order.update({
    where: { id: orderId },
    data: { trackingNumber: trackingNumber || null },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function togglePaymentConfirmed(
  orderId: string,
  paymentConfirmed: boolean,
) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentConfirmed },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderNotes(orderId: string, formData: FormData) {
  await requireAdmin();
  const notes = String(formData.get("notes") ?? "").trim();

  await prisma.order.update({
    where: { id: orderId },
    data: { notes: notes || null },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}
