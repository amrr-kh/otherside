import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CollectionGrid } from "@/components/storefront/CollectionGrid";

export const revalidate = 60;

export default async function CollectionPage({
  params,
}: PageProps<"/[locale]/collections/[slug]">) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!collection) notFound();

  return (
    <CollectionGrid
      collectionSlug={slug}
      title={collection.name}
      intro={collection.description}
    />
  );
}
