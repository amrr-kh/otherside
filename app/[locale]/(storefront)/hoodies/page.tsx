import { getTranslations } from "next-intl/server";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";

export const revalidate = 60;

export default async function HoodiesPage() {
  const t = await getTranslations("category");
  return (
    <CategoryGrid
      categorySlug="hoodies"
      title={t("hoodiesTitle")}
      intro={t("hoodiesIntro")}
    />
  );
}
