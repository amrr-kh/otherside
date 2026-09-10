import { CategoryGrid } from "@/components/storefront/CategoryGrid";

export const revalidate = 60;

export default function HoodiesPage() {
  return (
    <CategoryGrid
      categorySlug="hoodies"
      title="Hoodies"
      intro="Oversized silhouette and proportion, weight and movement. Every color, every size."
    />
  );
}
