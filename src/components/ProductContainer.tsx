import { useQuery } from "@tanstack/react-query";

import ProductCard from "./ProductCard";
import type { Product } from "../data/types";
// @ts-expect-error The JavaScript utility module has no TypeScript declaration.
import { fetchProductData } from "../data/utils";

export default function ProductContainer() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => fetchProductData(signal),
  });
  const products: Product[] = data?.data ?? [];
  console.log(products);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <section>
      <h3>Products</h3>
      <div className="grid grid-cols-4 gap-4 p-4">
        {products.length > 0 &&
          products.map((p) => <ProductCard key={crypto.randomUUID()} {...p} />)}
      </div>
    </section>
  );
}
