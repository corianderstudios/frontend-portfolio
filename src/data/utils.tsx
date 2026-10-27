import type { ProductResponse } from "./types";

export const API_ENDPOINT =
  "https://www.greatfrontend.com/api/projects/challenges/e-commerce/products";

export async function fetchProductData(
  signal: AbortSignal,
  page: number = 1,
): Promise<ProductResponse> {
  const res = await fetch(`${API_ENDPOINT}?page=${page}`, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
