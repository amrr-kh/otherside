import { prisma } from "@/lib/db";
import {
  createShippingZone,
  toggleShippingZone,
  updateShippingZonePrice,
  deleteShippingZone,
} from "./actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";

export default async function AdminShippingPage() {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold text-soft-black">Shipping Zones</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Checkout calculates shipping cost by matching the customer&apos;s
        governorate to one of these zones.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-lg border border-soft-black/10 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-soft-black">
                  {zone.name}
                </h2>
                <p className="mt-1 text-xs text-soft-black/50">
                  {zone.governorates.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={toggleShippingZone.bind(null, zone.id, !zone.isActive)}>
                  <button
                    type="submit"
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      zone.isActive
                        ? "bg-electric-violet/15 text-electric-violet"
                        : "bg-soft-black/10 text-soft-black/50"
                    }`}
                  >
                    {zone.isActive ? "ACTIVE" : "INACTIVE"}
                  </button>
                </form>
                <form action={deleteShippingZone.bind(null, zone.id)}>
                  <button
                    type="submit"
                    className="text-xs uppercase tracking-[0.1em] text-magenta hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <form
              action={updateShippingZonePrice.bind(null, zone.id)}
              className="mt-4 flex flex-wrap items-end gap-3"
            >
              <div>
                <label className="mb-1 block text-xs text-soft-black/50">
                  Price (EGP)
                </label>
                <input
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={Number(zone.price)}
                  className={`${inputClass} w-28`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-soft-black/50">
                  Delivery Estimate
                </label>
                <input
                  name="etaText"
                  defaultValue={zone.etaText}
                  className={`${inputClass} w-40`}
                />
              </div>
              <button
                type="submit"
                className="rounded border border-soft-black/20 px-3 py-2 text-xs uppercase tracking-[0.08em] text-soft-black/70 hover:bg-soft-black/5"
              >
                Save
              </button>
            </form>
          </div>
        ))}

        {zones.length === 0 ? (
          <p className="text-sm text-soft-black/50">
            No shipping zones yet — add one below.
          </p>
        ) : null}
      </div>

      <div className="mt-10 rounded-lg border border-soft-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold text-soft-black">Add Zone</h2>
        <form action={createShippingZone} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Zone Name
            </label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-soft-black/50">
              Governorates (comma-separated)
            </label>
            <input
              name="governorates"
              required
              placeholder="e.g. Cairo, Giza"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-soft-black/50">
                Price (EGP)
              </label>
              <input
                name="price"
                type="number"
                min={0}
                step="0.01"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-soft-black/50">
                Delivery Estimate
              </label>
              <input
                name="etaText"
                required
                placeholder="e.g. 1-2 days"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-fit bg-soft-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
          >
            Add Zone
          </button>
        </form>
      </div>
    </div>
  );
}
