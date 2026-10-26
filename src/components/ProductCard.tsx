import type { Product } from "../data/types";

export default function ProductCard({
  product_id,
  name,
  colors,
  priceRange,
  images,
}: Product) {
  return (
    <div id={`${product_id}`} className="flex flex-col">
      <div
        className="w-full h-50 rounded"
        style={{
          backgroundImage: `url(${images[0].image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div>
        <span className="text-xs capitalize mb-2">{colors[0]}</span>
        <p className="mb-2">{name}</p>
        <p className="text-neutral-500 mb-2">
          {formatUSD.format(priceRange.highest)}
        </p>
        <div className="flex gap-2">
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
