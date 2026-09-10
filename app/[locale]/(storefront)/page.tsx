import { Hero } from "@/components/storefront/sections/Hero";
import { BrandStory } from "@/components/storefront/sections/BrandStory";
import { DropSection } from "@/components/storefront/sections/DropSection";
import { EditorialFeature } from "@/components/storefront/sections/EditorialFeature";
import { CampaignSection } from "@/components/storefront/sections/CampaignSection";
import { SelectedProducts } from "@/components/storefront/sections/SelectedProducts";
import { MaterialSection } from "@/components/storefront/sections/MaterialSection";
import { Reviews } from "@/components/storefront/sections/Reviews";
import { Newsletter } from "@/components/storefront/sections/Newsletter";

// Product sections read from the database — without this the homepage would
// bake in build-time data and never show newly added products.
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStory />
      <DropSection />
      <EditorialFeature />
      <CampaignSection />
      <SelectedProducts />
      <MaterialSection />
      <Reviews />
      <Newsletter />
    </>
  );
}
