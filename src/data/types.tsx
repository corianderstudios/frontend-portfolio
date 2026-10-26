export type Product = {
  category: { category_id: number; name: string; created_at: string };
  product_id: number;
  name: string;
  colors: string[];
  priceRange: { lowest: number; highest: number };
  images: { image_id: number; image_url: string }[];
};
