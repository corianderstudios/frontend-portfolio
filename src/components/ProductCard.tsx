import { useState } from "react";

import type { Product } from "../data/types";

export default function ProductCard({
  product_id,
  name,
  colors,
  priceRange,
  images,
}: Partial<Product>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images === undefined || !images.length) return <p>No images available</p>;

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div id={`${product_id}`} className="flex flex-col product-card">
      <div className="product-gallery relative w-full max-w-60.25 my-0 mx-auto overflow-hidden">
        <div className="slider-container flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none">
          <img
            src={images?.[currentIndex]?.image_url}
            alt={name}
            className="w-full aspect-square object-cover rounded"
            loading="lazy"
          />

          {images.length > 1 && (
            <>
              <button
                className="absolute w-40 top-1/2 left-[-25%] cursor-pointer flex items-center justify-center translate-y-[-50%]"
                aria-label="Previous image"
                onClick={prevImage}
              >
                &#10094;
              </button>
              <button
                className="absolute w-40 top-1/2 right-[-25%] cursor-pointer flex items-center justify-center translate-y-[-50%]"
                aria-label="Next image"
                onClick={nextImage}
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <span className="text-xs capitalize mb-2">{colors?.[0]}</span>
        <p className="mb-2">{name}</p>
        <p className="text-neutral-500 mb-2">
          {formatUSD.format(priceRange?.highest ?? 0)}
        </p>
        <div className="flex gap-2">
          {colors?.map((color) => (
            <div
              key={`${product_id}-${color}`}
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
