import type { Product } from "./types";

export const API_ENDPOINT =
  "https://www.greatfrontend.com/api/projects/challenges/e-commerce/products";

export async function fetchProductData(
  signal: AbortSignal,
): Promise<Product[]> {
  const res = await fetch(API_ENDPOINT, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
