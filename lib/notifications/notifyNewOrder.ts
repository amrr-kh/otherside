import "server-only";

export type NewOrderNotification = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  governorate: string;
  city: string;
};

// Fires the email + WhatsApp alerts in parallel and never throws — a
// notification failure must never roll back or block an already-placed order.
export async function notifyNewOrder(
  order: NewOrderNotification,
): Promise<void> {
  await Promise.allSettled([sendOrderEmail(order), sendOrderWhatsApp(order)]);
}

function buildMessage(order: NewOrderNotification): string {
  return [
    `New OtherSide order ${order.orderNumber}`,
    `${order.customerName} · ${order.customerPhone}`,
    `${order.city}, ${order.governorate}`,
    `Total: EGP ${order.total.toLocaleString()} · ${order.paymentMethod}`,
  ].join("\n");
}

async function sendOrderEmail(order: NewOrderNotification): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["ADMIN_NOTIFICATION_EMAIL"];
  if (!apiKey || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env["RESEND_FROM_EMAIL"] ??
          "OtherSide Orders <orders@otherside.store>",
        to,
        subject: `New order ${order.orderNumber} — EGP ${order.total.toLocaleString()}`,
        text: buildMessage(order),
      }),
    });
    if (!res.ok) {
      console.error(
        "notifyNewOrder: Resend request failed",
        res.status,
        await res.text(),
      );
    }
  } catch (error) {
    console.error("notifyNewOrder: Resend request errored", error);
  }
}

async function sendOrderWhatsApp(order: NewOrderNotification): Promise<void> {
  const sid = process.env["TWILIO_ACCOUNT_SID"];
  const token = process.env["TWILIO_AUTH_TOKEN"];
  const from = process.env["TWILIO_WHATSAPP_FROM"];
  const to = process.env["ADMIN_WHATSAPP_TO"];
  if (!sid || !token || !from || !to) return;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
          To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
          Body: buildMessage(order),
        }),
      },
    );
    if (!res.ok) {
      console.error(
        "notifyNewOrder: Twilio request failed",
        res.status,
        await res.text(),
      );
    }
  } catch (error) {
    console.error("notifyNewOrder: Twilio request errored", error);
  }
}
