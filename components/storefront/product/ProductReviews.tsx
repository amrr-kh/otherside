"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { submitReview, type SubmitReviewState } from "@/lib/actions/reviews";

export type ProductReview = {
  id: string;
  customerName: string;
  rating: number;
  body: string;
  createdAt: string;
};

const initialState: SubmitReviewState = { status: "idle" };

export function ProductReviews({
  productId,
  productSlug,
  reviews,
}: {
  productId: string;
  productSlug: string;
  reviews: ProductReview[];
}) {
  const t = useTranslations("productReviews");
  const action = submitReview.bind(null, productId, productSlug);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <h2 className="font-display text-3xl italic text-warm-white md:text-4xl">
        {t("heading", { count: reviews.length })}
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-6 text-sm text-warm-white/45">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-t border-warm-white/10 pt-5"
            >
              <div className="flex text-gold">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5"
                    fill={i < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-warm-white/75">
                {review.body}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.1em] text-warm-white/40">
                {review.customerName}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 max-w-lg border-t border-warm-white/10 pt-8">
        {state.status === "success" ? (
          <p className="text-sm text-electric-violet">{t("thankYou")}</p>
        ) : (
          <>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-warm-white">
              {t("writeReview")}
            </h3>
            <form action={formAction} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50">
                  {t("rating")}
                </label>
                <div
                  className="flex gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = i + 1;
                    const filled = value <= (hoverRating || rating);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        aria-label={`${value}`}
                        className="p-0.5 text-gold"
                      >
                        <Star
                          className="h-6 w-6"
                          fill={filled ? "currentColor" : "none"}
                        />
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="rating" value={rating} />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50"
                  htmlFor="customerName"
                >
                  {t("name")}
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  required
                  maxLength={80}
                  className="w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white focus:border-electric-violet focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-warm-white/50"
                  htmlFor="body"
                >
                  {t("body")}
                </label>
                <textarea
                  id="body"
                  name="body"
                  required
                  rows={4}
                  maxLength={2000}
                  className="w-full border border-warm-white/25 bg-transparent px-4 py-3 text-sm text-warm-white focus:border-electric-violet focus:outline-none"
                />
              </div>

              {state.status === "error" ? (
                <p className="text-sm text-magenta">
                  {t(`error${state.message.charAt(0).toUpperCase()}${state.message.slice(1)}`)}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending || rating === 0}
                className="w-fit border border-warm-white/70 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? t("submitting") : t("submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
