import { cairoLocalToUtc } from "@/lib/cairo-time";
import { isSafeCtaUrl } from "@/lib/promotion-shared";

export type PromotionScopeValue = "STORE" | "COLLECTIONS" | "PRODUCTS";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string, max: number) {
  const value = text(formData, key);
  if (value.length > max) throw new Error(`${key} is too long (max ${max}).`);
  return value === "" ? null : value;
}

/**
 * Validates the admin's Limited Offer form. Kept apart from the server actions
 * (which may only export async functions) so it can be tested directly. Throws
 * an Error with a plain-English message for anything wrong.
 */
export function readPromotionFields(formData: FormData) {
  const title = text(formData, "title");
  const ctaText = text(formData, "ctaText");
  const ctaUrl = text(formData, "ctaUrl");

  if (!title) throw new Error("Title is required.");
  if (title.length > 60) throw new Error("Title is too long (max 60).");
  if (!ctaText) throw new Error("Button text is required.");
  if (ctaText.length > 30) throw new Error("Button text is too long (max 30).");
  if (!isSafeCtaUrl(ctaUrl)) {
    throw new Error(
      "Button link must be a page on this site (like /hoodies) or a full https:// link.",
    );
  }

  // The admin types Cairo wall-clock time; the database stores the real instant.
  const startsAt = cairoLocalToUtc(text(formData, "startsAt"));
  const endsAt = cairoLocalToUtc(text(formData, "endsAt"));
  if (!startsAt) throw new Error("Start date and time is required.");
  if (!endsAt) throw new Error("End date and time is required.");
  if (endsAt.getTime() <= startsAt.getTime()) {
    throw new Error("The end must be after the start.");
  }

  const scope = text(formData, "scope") as PromotionScopeValue;
  if (scope !== "STORE" && scope !== "COLLECTIONS" && scope !== "PRODUCTS") {
    throw new Error("Invalid scope.");
  }
  const productIds =
    scope === "PRODUCTS" ? formData.getAll("productIds").map(String) : [];
  const collectionIds =
    scope === "COLLECTIONS" ? formData.getAll("collectionIds").map(String) : [];
  if (scope === "PRODUCTS" && productIds.length === 0) {
    throw new Error("Pick at least one product, or choose the entire store.");
  }
  if (scope === "COLLECTIONS" && collectionIds.length === 0) {
    throw new Error("Pick at least one collection, or choose the entire store.");
  }

  const percentRaw = text(formData, "discountPercent");
  const discountPercent = percentRaw === "" ? null : Number(percentRaw);
  if (
    discountPercent !== null &&
    (!Number.isInteger(discountPercent) ||
      discountPercent < 1 ||
      discountPercent > 90)
  ) {
    throw new Error("Percentage off must be a whole number from 1 to 90.");
  }

  const showTopBar = formData.get("showTopBar") === "on";
  const showOnProductPages = formData.get("showOnProductPages") === "on";
  if (!showTopBar && !showOnProductPages) {
    throw new Error("Choose at least one place for the countdown to appear.");
  }

  return {
    fields: {
      isActive: formData.get("isActive") === "on",
      title,
      message: optionalText(formData, "message", 160),
      ctaText,
      ctaUrl,
      titleAr: optionalText(formData, "titleAr", 60),
      messageAr: optionalText(formData, "messageAr", 160),
      ctaTextAr: optionalText(formData, "ctaTextAr", 30),
      startsAt,
      endsAt,
      showTopBar,
      showOnProductPages,
      discountPercent,
      scope,
    },
    productIds,
    collectionIds,
  };
}
