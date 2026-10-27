type Product = {
  category: { category_id: number; name: string; created_at: string };
  collection: {
    collection_id: string;
    name: string;
    description: string;
    image_url: string;
    created_at: string;
  };
  colors: string[];
  created_at: string;
  description: string;
  images: { color: string; image_url: string }[];
  inventory: [];
  name: string;
  priceRange: { highest: number; lowest: number };
  product_id: string;
  rating: number;
  reviews: number;
  sizes: string[];
  sold: number;
};

type Pagination = {
  hasMore: boolean;
  page: number;
  per_page: number;
  total: number;
};

export type ProductResponse = {
  data: Product[];
  pagination: Pagination;
};
