import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import ProductDetails from "./ProductDetails";
import { fetchProductById } from "../data/utils";

export default function ProductDetailsPage() {
  const { productId } = useParams();

  if (!productId) return <p>Product not found.</p>;

  return <ProductDetailsQuery productId={productId} />;
}

function ProductDetailsQuery({ productId }: { productId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => fetchProductById(signal, productId),
  });

  if (isLoading) return <p>Loading product...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!data) return <p>Product not found.</p>;

  return <ProductDetails {...data} />;
}
