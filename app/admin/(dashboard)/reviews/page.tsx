import { prisma } from "@/lib/db";
import { approveReview, unapproveReview, deleteReview } from "./actions";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-soft-black/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { isDemo: false },
    include: { product: { select: { name: true } } },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-soft-black">Reviews</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        {pending.length} pending, {approved.length} live on the site.
      </p>

      {pending.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-soft-black/70">
            Pending Approval
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {pending.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-soft-black/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-soft-black">
                      {review.customerName}
                      <span className="ml-2 font-normal text-soft-black/40">
                        on {review.product.name}
                      </span>
                    </p>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="shrink-0 text-xs text-soft-black/40">
                    {review.createdAt.toLocaleDateString("en-GB")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-soft-black/70">
                  {review.body}
                </p>
                <div className="mt-3 flex gap-4">
                  <form action={approveReview.bind(null, review.id)}>
                    <button
                      type="submit"
                      className="text-xs font-medium uppercase tracking-[0.1em] text-electric-violet hover:underline"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={deleteReview.bind(null, review.id)}>
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-soft-black/70">
          Live on Site
        </h2>
        {approved.length === 0 ? (
          <p className="mt-3 text-sm text-soft-black/50">
            No approved reviews yet.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {approved.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-soft-black/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-soft-black">
                      {review.customerName}
                      <span className="ml-2 font-normal text-soft-black/40">
                        on {review.product.name}
                      </span>
                    </p>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="shrink-0 text-xs text-soft-black/40">
                    {review.createdAt.toLocaleDateString("en-GB")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-soft-black/70">
                  {review.body}
                </p>
                <div className="mt-3 flex gap-4">
                  <form action={unapproveReview.bind(null, review.id)}>
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-[0.1em] text-soft-black/50 hover:underline"
                    >
                      Unpublish
                    </button>
                  </form>
                  <form action={deleteReview.bind(null, review.id)}>
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
