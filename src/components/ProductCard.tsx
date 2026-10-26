import type { Product } from "../data/types";

export default function ProductCard({
  product_id,
  name,
  colors,
  priceRange,
  images,
}: Product) {
  return (
    <div id={`${product_id}`}>
      <img src={images[0].image_url} width="250" height="400" />
      <div>
        <span>{colors[0]}</span>
        <p>{name}</p>
        <p>{formatUSD.format(priceRange.highest)}</p>
        <div className="flex justfy-between">
          {colors.map((color) => (
            <div
              className="rounded-full h-2.5 w-2.5 border"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
