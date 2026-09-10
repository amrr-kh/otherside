import { getTranslations } from "next-intl/server";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";

export const revalidate = 60;

export default async function PantsPage() {
  const t = await getTranslations("category");
  return (
    <CategoryGrid
      categorySlug="pants"
      title={t("pantsTitle")}
      intro={t("pantsIntro")}
    />
  );
}
