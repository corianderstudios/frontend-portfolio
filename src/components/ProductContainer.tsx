import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import ProductCard from "./ProductCard";
import type { ProductResponse } from "../data/types";
import { fetchProductData } from "../data/utils";

export default function ProductContainer() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page],
    queryFn: ({ signal }) => fetchProductData(signal, page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.pagination.hasMore) {
      queryClient.query({
        queryKey: ["products", page + 1],
        queryFn: ({ signal }) => fetchProductData(signal, page + 1),
      });
    }
  }, [data, page, queryClient]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data)
    return <p>Error: {error?.message ?? "An error occurred"}</p>;

  const products: ProductResponse["data"] = data.data;
  const totalPages = Math.ceil(
    data.pagination.total / data.pagination.per_page,
  );

  return (
    <section>
      <h3>Products</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((p) => (
          <Link key={p.product_id} to={`/products/${p.product_id}`}>
            <ProductCard {...p} />
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-4 p-4">
        <button
          className="cursor-pointer"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          &#10094; Back
        </button>
        {`${page} of ${totalPages}`}
        <button
          className="cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          Next &#10095;
        </button>
      </div>
    </section>
  );
}
