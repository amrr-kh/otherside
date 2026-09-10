export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  compareAtPrice: number | null;
  material: string | null;
  fit: string | null;
  care: string | null;
  colors: { id: string; value: string; swatchHex: string | null }[];
  sizes: { id: string; value: string }[];
  images: {
    id: string;
    url: string;
    role: string;
    colorOptionValueId: string;
    sortOrder: number;
  }[];
  variants: { id: string; colorId: string; sizeId: string; quantity: number }[];
};
