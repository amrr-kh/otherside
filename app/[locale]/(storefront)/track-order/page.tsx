import { getTranslations } from "next-intl/server";
import { TrackOrderForm } from "@/components/storefront/TrackOrderForm";

export default async function TrackOrderPage() {
  const t = await getTranslations("trackOrder");

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        {t("eyebrow")}
      </p>
      <h1 className="mt-5 font-display text-4xl italic text-warm-white md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-4 max-w-md text-sm text-warm-white/55">
        {t("intro")}
      </p>

      <div className="mt-10">
        <TrackOrderForm />
      </div>
    </div>
  );
}
