import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import ProductContainer from "./ProductContainer";
import { API_ENDPOINT } from "../data/utils";
import { makeProduct } from "../test/productFixture";

function response(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function renderProductContainer() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ProductContainer />
      </QueryClientProvider>,
    ),
  };
}

describe("ProductContainer query", () => {
  it("shows a loading state while the product request is pending", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));

    renderProductContainer();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders products returned by the query", async () => {
    const product = makeProduct();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ data: [product] }));

    renderProductContainer();

    expect(await screen.findByText("Runner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      API_ENDPOINT,
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it("shows the request error when the query fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      response(null, false, 503),
    );

    renderProductContainer();

    expect(await screen.findByText("Error: Request failed: 503")).toBeInTheDocument();
  });

  it("renders each product returned by the query", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      response({
        data: [
          makeProduct(),
          makeProduct({ product_id: "product-2", name: "Trail shoe" }),
        ],
      }),
    );

    renderProductContainer();

    await waitFor(() => {
      expect(screen.getByText("Runner")).toBeInTheDocument();
      expect(screen.getByText("Trail shoe")).toBeInTheDocument();
    });
  });
});
