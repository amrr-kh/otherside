import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "./actions";

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";
const labelClass = "mb-1 block text-xs text-soft-black/50";

export default async function AdminContentPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-soft-black">Content</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Social links, contact info, and a site-wide banner shown across the
        storefront.
      </p>

      <form action={updateSiteSettings} className="mt-8 flex flex-col gap-8">
        <section className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">
            Social &amp; Contact
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="instagramUrl">
                Instagram URL
              </label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                dir="ltr"
                defaultValue={settings.instagramUrl}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="facebookUrl">
                Facebook URL
              </label>
              <input
                id="facebookUrl"
                name="facebookUrl"
                dir="ltr"
                defaultValue={settings.facebookUrl}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="tiktokUrl">
                TikTok URL
              </label>
              <input
                id="tiktokUrl"
                name="tiktokUrl"
                dir="ltr"
                defaultValue={settings.tiktokUrl}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="whatsappNumber">
                WhatsApp Number (digits only, with country code)
              </label>
              <input
                id="whatsappNumber"
                name="whatsappNumber"
                dir="ltr"
                placeholder="201xxxxxxxxx"
                defaultValue={settings.whatsappNumber}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="contactEmail">
                Contact Email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                dir="ltr"
                defaultValue={settings.contactEmail}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-soft-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-soft-black">
            Announcement Banner
          </h2>
          <p className="mt-1 text-xs text-soft-black/50">
            Shows as a thin strip above the header on every storefront page.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex items-center gap-2 text-sm text-soft-black/70">
              <input
                type="checkbox"
                name="bannerEnabled"
                defaultChecked={settings.bannerEnabled}
                className="accent-electric-violet"
              />
              Show banner
            </label>
            <div>
              <label className={labelClass} htmlFor="bannerText">
                Banner Text
              </label>
              <input
                id="bannerText"
                name="bannerText"
                placeholder="e.g. Free shipping on orders over EGP 1,500"
                defaultValue={settings.bannerText ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="bannerLinkUrl">
                Banner Link (optional — internal path like /hoodies, or a full URL)
              </label>
              <input
                id="bannerLinkUrl"
                name="bannerLinkUrl"
                dir="ltr"
                defaultValue={settings.bannerLinkUrl ?? ""}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-fit bg-soft-black px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-warm-white hover:opacity-90"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
