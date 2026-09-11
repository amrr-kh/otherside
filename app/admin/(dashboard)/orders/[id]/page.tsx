import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CustomSelect } from "@/components/CustomSelect";
import {
  updateOrderStatus,
  setTrackingNumber,
  togglePaymentConfirmed,
  updateOrderNotes,
} from "../actions";

const STATUS_OPTIONS = [
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  const address = order.addressSnapshot as {
    name: string;
    phone: string;
    governorate: string;
    city: string;
    street: string;
    building: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
  };

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="text-xs uppercase tracking-[0.1em] text-soft-black/45 hover:text-soft-black"
      >
        ← All Orders
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold text-soft-black">
          {order.orderNumber}
        </h1>
        <span className="text-xs text-soft-black/45">
          Placed {order.createdAt.toLocaleString("en-GB")}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Items</h2>
          <ul className="mt-3 space-y-2 text-sm text-soft-black/70">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.productNameSnapshot} — {item.colorSnapshot} /{" "}
                  {item.sizeSnapshot} × {item.quantity}
                </span>
                <span>
                  EGP{" "}
                  {(Number(item.unitPrice) * item.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-soft-black/10 pt-3 text-sm">
            <div className="flex justify-between text-soft-black/60">
              <span>Subtotal</span>
              <span>EGP {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-soft-black/60">
              <span>Shipping</span>
              <span>EGP {Number(order.shippingCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-soft-black">
              <span>Total</span>
              <span>EGP {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Customer</h2>
          <p className="mt-3 text-sm text-soft-black/70">
            {address.name} · {address.phone}
          </p>
          {order.customer.email ? (
            <p className="text-sm text-soft-black/70">
              {order.customer.email}
            </p>
          ) : null}
          <h3 className="mt-4 text-xs uppercase tracking-[0.08em] text-soft-black/45">
            Delivery Address
          </h3>
          <p className="mt-1 text-sm text-soft-black/70">
            {address.street}, {address.building}
            {address.floor ? `, ${address.floor}` : ""}
            {address.apartment ? `, ${address.apartment}` : ""}
            <br />
            {address.city}, {address.governorate}
            {address.landmark ? (
              <>
                <br />
                Landmark: {address.landmark}
              </>
            ) : null}
          </p>
          {order.notes ? (
            <>
              <h3 className="mt-4 text-xs uppercase tracking-[0.08em] text-soft-black/45">
                Delivery Notes
              </h3>
              <p className="mt-1 text-sm text-soft-black/70">{order.notes}</p>
            </>
          ) : null}
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Payment</h2>
          <p className="mt-2 text-sm text-soft-black/70">
            {order.paymentMethod}
          </p>
          <form
            action={togglePaymentConfirmed.bind(
              null,
              order.id,
              !order.paymentConfirmed,
            )}
            className="mt-3"
          >
            <button
              type="submit"
              className={`rounded px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] ${
                order.paymentConfirmed
                  ? "bg-green-600/15 text-green-700"
                  : "bg-soft-black/10 text-soft-black/70"
              }`}
            >
              {order.paymentConfirmed
                ? "Payment Confirmed ✓"
                : "Mark Payment Confirmed"}
            </button>
          </form>

          <h3 className="mt-5 text-xs uppercase tracking-[0.08em] text-soft-black/45">
            Tracking Number
          </h3>
          <form
            action={setTrackingNumber.bind(null, order.id)}
            className="mt-2 flex gap-2"
          >
            <input
              name="trackingNumber"
              defaultValue={order.trackingNumber ?? ""}
              placeholder="Courier tracking number"
              className={inputClass}
            />
            <button
              type="submit"
              className="shrink-0 rounded border border-soft-black/20 px-3 py-2 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
            >
              Save
            </button>
          </form>

          <h3 className="mt-5 text-xs uppercase tracking-[0.08em] text-soft-black/45">
            Internal Notes
          </h3>
          <form
            action={updateOrderNotes.bind(null, order.id)}
            className="mt-2 flex flex-col gap-2"
          >
            <textarea
              name="notes"
              defaultValue={order.notes ?? ""}
              rows={2}
              placeholder="Internal note — not shown to the customer"
              className={inputClass}
            />
            <button
              type="submit"
              className="w-fit rounded border border-soft-black/20 px-3 py-2 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
            >
              Save Note
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">Status</h2>
          <form
            action={updateOrderStatus.bind(null, order.id)}
            className="mt-3 flex flex-col gap-3"
          >
            <CustomSelect
              name="status"
              defaultValue={order.status}
              theme="light"
              options={STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status.replaceAll("_", " "),
              }))}
            />
            <input
              name="note"
              placeholder="Note for this status change (optional)"
              className={inputClass}
            />
            <button
              type="submit"
              className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
            >
              Update Status
            </button>
          </form>

          <h3 className="mt-5 text-xs uppercase tracking-[0.08em] text-soft-black/45">
            History
          </h3>
          <ul className="mt-2 space-y-2 text-sm text-soft-black/70">
            {order.statusHistory.map((entry) => (
              <li key={entry.id} className="border-t border-soft-black/5 pt-2 first:border-0 first:pt-0">
                <span className="font-medium text-soft-black">
                  {entry.status.replaceAll("_", " ")}
                </span>{" "}
                <span className="text-xs text-soft-black/40">
                  {entry.createdAt.toLocaleString("en-GB")}
                </span>
                {entry.note ? (
                  <p className="text-xs text-soft-black/50">{entry.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
