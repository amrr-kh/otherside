"use server";

import bcrypt from "bcryptjs";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import {
  createCustomerSession,
  destroyCustomerSession,
} from "@/lib/customer-session";

const EGYPT_PHONE_RE = /^01[0125][0-9]{8}$/;

export type AccountFormState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function signUp(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !phone || !password || !confirmPassword) {
    return { status: "error", message: "missingFields" };
  }
  if (!EGYPT_PHONE_RE.test(phone)) {
    return { status: "error", message: "invalidPhone" };
  }
  if (password.length < 8) {
    return { status: "error", message: "passwordTooShort" };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "passwordMismatch" };
  }

  const existing = await prisma.customer.findUnique({ where: { phone } });
  if (existing?.passwordHash) {
    return { status: "error", message: "phoneRegistered" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // A guest checkout may have already created this Customer row by phone —
  // claim it (and its order history) instead of erroring or duplicating.
  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: { name, email: email || existing.email, passwordHash },
      })
    : await prisma.customer.create({
        data: { name, phone, email: email || null, passwordHash },
      });

  await createCustomerSession(customer.id);

  const locale = await getLocale();
  redirect({ href: "/account", locale });
  return { status: "idle" };
}

export async function logIn(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!phone || !password) {
    return { status: "error", message: "missingFields" };
  }

  const customer = await prisma.customer.findUnique({ where: { phone } });
  if (!customer?.passwordHash) {
    return { status: "error", message: "invalidCredentials" };
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    return { status: "error", message: "invalidCredentials" };
  }

  await createCustomerSession(customer.id);

  const locale = await getLocale();
  redirect({ href: "/account", locale });
  return { status: "idle" };
}

export async function logOut(): Promise<void> {
  await destroyCustomerSession();
  const locale = await getLocale();
  redirect({ href: "/", locale });
}
