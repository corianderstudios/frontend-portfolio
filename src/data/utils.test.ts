import { describe, expect, it, vi } from "vitest";

import { API_ENDPOINT, fetchProductData } from "./utils";
import { makeProduct } from "../test/productFixture";

describe("fetchProductData", () => {
  it("requests and returns the product data using the query abort signal", async () => {
    const payload = { data: [makeProduct()] };
    const signal = new AbortController().signal;
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    await expect(fetchProductData(signal)).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(`${API_ENDPOINT}?page=1`, { signal });
  });

  it("includes the requested page in the URL", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], pagination: {} }),
    } as Response);
    const signal = new AbortController().signal;

    await fetchProductData(signal, 3);

    expect(fetch).toHaveBeenCalledWith(`${API_ENDPOINT}?page=3`, { signal });
  });

  it("throws when the product request is unsuccessful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    await expect(fetchProductData(new AbortController().signal)).rejects.toThrow(
      "Request failed: 503",
    );
  });
});
