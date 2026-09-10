import "server-only";

export type OrderSheetRow = {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  items: string;
  subtotal: number;
  shippingCost: number;
  discountCode: string;
  discountAmount: number;
  total: number;
  paymentMethod: string;
};

// Fire-and-forget — a Sheets outage must never block or fail a real order.
// Posts to a Google Apps Script Web App bound to the target Sheet (see
// docs/google-sheets-setup, or the admin onboarding message) rather than the
// full Sheets API, so there's no service-account key to manage.
export async function logOrderToSheet(row: OrderSheetRow): Promise<void> {
  const webhookUrl = process.env["GOOGLE_SHEETS_WEBHOOK_URL"];
  if (!webhookUrl) return;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      console.error(
        "logOrderToSheet: webhook request failed",
        res.status,
        await res.text(),
      );
    }
  } catch (error) {
    console.error("logOrderToSheet: webhook request errored", error);
  }
}
