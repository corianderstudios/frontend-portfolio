import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import ProductContainer from "./ProductContainer";
import type { Product, ProductResponse } from "../data/types";
import { API_ENDPOINT } from "../data/utils";
import { makeProduct } from "../test/productFixture";

function response(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function productResponse(
  products: Product[],
  page: number,
  hasMore: boolean,
  total: number,
): ProductResponse {
  return {
    data: products,
    pagination: { hasMore, page, per_page: 2, total },
  };
}

function renderProductContainer() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 60_000, staleTime: 60_000 },
    },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProductContainer />
        </MemoryRouter>
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
      .mockResolvedValue(
        response(productResponse([product], 1, false, 1)),
      );

    renderProductContainer();

    expect(await screen.findByText("Runner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_ENDPOINT}?page=1`,
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
      response(
        productResponse(
          [
          makeProduct(),
          makeProduct({ product_id: "product-2", name: "Trail shoe" }),
          ],
          1,
          false,
          2,
        ),
      ),
    );

    renderProductContainer();

    await waitFor(() => {
      expect(screen.getByText("Runner")).toBeInTheDocument();
      expect(screen.getByText("Trail shoe")).toBeInTheDocument();
    });
  });

  it("prefetches the next page and navigates between pages", async () => {
    const user = userEvent.setup();
    const pageOne = makeProduct();
    const pageTwo = makeProduct({
      product_id: "product-2",
      name: "Trail shoe",
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const page = Number(new URL(String(input)).searchParams.get("page"));
        return response(
          page === 1
            ? productResponse([pageOne], 1, true, 3)
            : productResponse([pageTwo], page, false, 3),
        );
      });

    renderProductContainer();

    expect(await screen.findByText("Runner")).toBeInTheDocument();
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_ENDPOINT}?page=2`,
        expect.objectContaining({ signal: expect.anything() }),
      );
    });

    await user.click(screen.getByRole("button", { name: "Next ❯" }));
    expect(await screen.findByText("Trail shoe")).toBeInTheDocument();
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("button", { name: "❮ Back" }));
    expect(await screen.findByText("Runner")).toBeInTheDocument();
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("does not prefetch another page when there are no more results", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response(
          productResponse([makeProduct()], 1, false, 1),
        ),
      );

    renderProductContainer();

    expect(await screen.findByText("1 of 1")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).not.toHaveBeenCalledWith(
      `${API_ENDPOINT}?page=2`,
      expect.anything(),
    );
  });
});
