import { prisma } from "@/lib/db";
import {
  createDiscountCode,
  toggleDiscountCode,
  deleteDiscountCode,
} from "./actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-soft-black">
        Discount Codes
      </h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Customers enter a code at checkout to get a percent or fixed amount
        off their subtotal.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {codes.map((discount) => {
          const expired =
            discount.expiresAt !== null && discount.expiresAt < new Date();
          const usedUp =
            discount.usageLimit !== null &&
            discount.timesUsed >= discount.usageLimit;
          return (
            <div
              key={discount.id}
              className="rounded-lg border border-soft-black/10 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="font-display text-sm font-semibold text-soft-black"
                    dir="ltr"
                  >
                    {discount.code}
                  </h2>
                  <p className="mt-1 text-xs text-soft-black/50">
                    {discount.type === "PERCENT"
                      ? `${Number(discount.value)}% off`
                      : `EGP ${Number(discount.value).toLocaleString()} off`}
                    {discount.minSubtotal
                      ? ` · min subtotal EGP ${Number(discount.minSubtotal).toLocaleString()}`
                      : ""}
                    {discount.expiresAt
                      ? ` · expires ${discount.expiresAt.toLocaleDateString("en-GB")}`
                      : ""}
                    {discount.usageLimit
                      ? ` · used ${discount.timesUsed}/${discount.usageLimit}`
                      : ` · used ${discount.timesUsed}×`}
                  </p>
                  {expired || usedUp ? (
                    <p className="mt-1 text-xs font-medium text-magenta">
                      {expired ? "Expired" : "Usage limit reached"} — no
                      longer redeemable even if marked active.
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <form
                    action={toggleDiscountCode.bind(
                      null,
                      discount.id,
                      !discount.isActive,
                    )}
                  >
                    <button
                      type="submit"
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        discount.isActive
                          ? "bg-electric-violet/15 text-electric-violet"
                          : "bg-soft-black/10 text-soft-black/50"
                      }`}
                    >
                      {discount.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </form>
                  <form action={deleteDiscountCode.bind(null, discount.id)}>
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}

        {codes.length === 0 ? (
          <p className="text-sm text-soft-black/50">
            No discount codes yet — add one below.
          </p>
        ) : null}
      </div>

      <div className="mt-10 rounded-lg border border-soft-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold text-soft-black">
          Add Discount Code
        </h2>
        <form
          action={createDiscountCode}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Code
            </label>
            <input
              name="code"
              required
              placeholder="e.g. WELCOME10"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Type
            </label>
            <select name="type" required defaultValue="PERCENT" className={inputClass}>
              <option value="PERCENT">Percent off</option>
              <option value="FIXED">Fixed amount off (EGP)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Value
            </label>
            <input
              name="value"
              type="number"
              min={0}
              step="0.01"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Minimum Subtotal (EGP, optional)
            </label>
            <input
              name="minSubtotal"
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Expires On (optional)
            </label>
            <input name="expiresAt" type="date" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Usage Limit (optional)
            </label>
            <input
              name="usageLimit"
              type="number"
              min={1}
              step="1"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90 sm:col-span-2"
          >
            Add Code
          </button>
        </form>
      </div>
    </div>
  );
}
