import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import ProductDetailsPage from "./ProductDetailsPage";
import { API_ENDPOINT } from "../data/utils";
import { makeProduct } from "../test/productFixture";

function renderProductDetailsPage(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/products/:productId"
            element={<ProductDetailsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ProductDetailsPage", () => {
  it("loads the product ID from the route and renders its details", async () => {
    const product = makeProduct();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => product,
    } as Response);

    renderProductDetailsPage(`/products/${product.product_id}`);

    expect(
      await screen.findByRole("heading", { name: product.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_ENDPOINT}/${product.product_id}`,
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it("shows a loading message while the product is loading", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));

    renderProductDetailsPage("/products/product-1");

    expect(screen.getByText("Loading product...")).toBeInTheDocument();
  });

  it("shows an error when the product cannot be loaded", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    renderProductDetailsPage("/products/missing-product");

    expect(
      await screen.findByText("Error: Request failed: 404"),
    ).toBeInTheDocument();
  });
});
