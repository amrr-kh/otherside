"use server";

import bcrypt from "bcryptjs";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  createCustomerSession,
  destroyCustomerSession,
  getCustomerSession,
} from "@/lib/customer-session";
import { normalizeAddress, saveAddressIfNew } from "@/lib/customer-addresses";
import { getActiveShippingZones } from "@/lib/storefront/shipping";

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

export type AddressFormState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string };

function readAddress(formData: FormData) {
  const value = (key: string) => String(formData.get(key) ?? "");
  return {
    governorate: value("governorate"),
    city: value("city"),
    street: value("street"),
    building: value("building"),
    floor: value("floor"),
    apartment: value("apartment"),
    landmark: value("landmark"),
  };
}

/** Creates a new saved address, or updates one when `id` is present. Only ever touches the signed-in customer's own addresses. */
export async function saveAddress(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const session = await getCustomerSession();
  if (!session) return { status: "error", message: "notSignedIn" };

  const input = readAddress(formData);
  const address = normalizeAddress(input);
  if (!address.governorate || !address.city || !address.street || !address.building) {
    return { status: "error", message: "missingFields" };
  }

  const zones = await getActiveShippingZones();
  if (!zones.some((zone) => zone.governorates.includes(address.governorate))) {
    return { status: "error", message: "noShippingZone" };
  }

  const id = String(formData.get("id") ?? "");
  if (id) {
    const own = await prisma.address.findFirst({
      where: { id, customerId: session.id },
      select: { id: true },
    });
    if (!own) return { status: "error", message: "notFound" };
    await prisma.address.update({ where: { id }, data: address });
  } else {
    await saveAddressIfNew(prisma, session.id, input);
  }

  revalidatePath("/[locale]/account", "page");
  return { status: "saved" };
}

export async function deleteAddress(addressId: string): Promise<void> {
  const session = await getCustomerSession();
  if (!session) return;

  await prisma.address.deleteMany({
    where: { id: addressId, customerId: session.id },
  });
  revalidatePath("/[locale]/account", "page");
}
