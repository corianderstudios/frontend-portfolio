import { useState, useEffect } from "react";
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
      queryClient.prefetchQuery({
        queryKey: ["products", page + 1],
        queryFn: ({ signal }) => fetchProductData(signal, page + 1),
      });
    }
  }, [data, page, queryClient]);

  const products: ProductResponse["data"] = data?.data ?? [];

  console.log("data", data);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <section>
      <h3>Products</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.length > 0 &&
          products.map((p) => <ProductCard key={p.product_id} {...p} />)}
      </div>
    </section>
  );
}
