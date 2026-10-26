import type { Product } from "../data/types";

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    category: { category_id: 1, name: "Shoes", created_at: "2026-01-01" },
    collection: {
      collection_id: "collection-1",
      name: "Everyday",
      description: "Everyday products",
      image_url: "/collection.jpg",
      created_at: "2026-01-01",
    },
    colors: ["blue", "red"],
    created_at: "2026-01-01",
    description: "A comfortable shoe",
    images: [
      { color: "blue", image_url: "/blue.jpg" },
      { color: "red", image_url: "/red.jpg" },
    ],
    inventory: [],
    name: "Runner",
    priceRange: { highest: 49.99, lowest: 39.99 },
    product_id: "product-1",
    rating: 4.5,
    reviews: 12,
    sizes: ["8", "9"],
    sold: 100,
    ...overrides,
  };
}
