import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCart } from "@/lib/storefront/cart";
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions/cart";

export const revalidate = 0;

export default async function CartPage() {
  const t = await getTranslations("cart");
  const { items, subtotal } = await getCart();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl italic text-warm-white md:text-5xl">
        {t("title")}
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-warm-white/50">{t("empty")}</p>
          <Link
            href="/hoodies"
            className="mt-6 inline-block border border-warm-white/70 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div className="divide-y divide-warm-white/10 border-y border-warm-white/10">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden bg-soft-black sm:h-36 sm:w-28"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-sm text-warm-white hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-xs text-warm-white/45">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm text-gold">
                      EGP {(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-warm-white/25">
                      <form
                        action={updateCartItemQuantity.bind(
                          null,
                          item.id,
                          item.quantity - 1,
                        )}
                      >
                        <button
                          type="submit"
                          aria-label={t("decreaseQuantity")}
                          className="flex h-9 w-9 items-center justify-center text-warm-white/70 hover:text-warm-white"
                        >
                          −
                        </button>
                      </form>
                      <span className="w-8 text-center text-sm text-warm-white">
                        {item.quantity}
                      </span>
                      <form
                        action={updateCartItemQuantity.bind(
                          null,
                          item.id,
                          item.quantity + 1,
                        )}
                      >
                        <button
                          type="submit"
                          aria-label={t("increaseQuantity")}
                          className="flex h-9 w-9 items-center justify-center text-warm-white/70 hover:text-warm-white"
                        >
                          +
                        </button>
                      </form>
                    </div>

                    <form action={removeCartItem.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-[0.1em] text-warm-white/40 hover:text-magenta"
                      >
                        {t("remove")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-end gap-1">
            <div className="flex w-full max-w-xs justify-between text-sm text-warm-white/60 sm:w-64">
              <span>{t("subtotal")}</span>
              <span className="text-warm-white">
                EGP {subtotal.toLocaleString()}
              </span>
            </div>
            <p className="max-w-xs text-end text-xs text-warm-white/35 sm:w-64">
              {t("shippingNote")}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-end">
            <button
              type="button"
              disabled
              className="w-full max-w-xs cursor-not-allowed bg-warm-white/15 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-warm-white/40 sm:w-64"
            >
              {t("checkoutComingSoon")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
