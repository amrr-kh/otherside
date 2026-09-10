"use server";

import { prisma } from "@/lib/db";

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  trackingNumber: string | null;
  items: { name: string; color: string; size: string; quantity: number }[];
  statusHistory: { status: string; note: string | null; createdAt: string }[];
};

export type TrackOrderState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "found"; order: TrackedOrder };

export async function trackOrderAction(
  _prevState: TrackOrderState,
  formData: FormData,
): Promise<TrackOrderState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!orderNumber || !phone) {
    return {
      status: "error",
      message: "Enter both your order number and phone number.",
    };
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber.toUpperCase(),
      customer: { phone },
    },
    include: {
      statusHistory: { orderBy: { createdAt: "asc" } },
      items: true,
    },
  });

  if (!order) {
    return {
      status: "error",
      message:
        "No order found matching that order number and phone number. Double-check both and try again.",
    };
  }

  return {
    status: "found",
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      trackingNumber: order.trackingNumber,
      items: order.items.map((item) => ({
        name: item.productNameSnapshot,
        color: item.colorSnapshot,
        size: item.sizeSnapshot,
        quantity: item.quantity,
      })),
      statusHistory: order.statusHistory.map((h) => ({
        status: h.status,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
    },
  };
}
