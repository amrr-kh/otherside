import { CategoryGrid } from "@/components/storefront/CategoryGrid";

export const revalidate = 60;

export default function PantsPage() {
  return (
    <CategoryGrid
      categorySlug="pants"
      title="Pants"
      intro="Fluid wide-leg pants built for the full silhouette. Every color, every size."
    />
  );
}
