import { useState } from "react";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";

import type { Product } from "../data/types";

export default function ProductDetails(props: Product) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="product-details p-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm">
        <IoIosArrowRoundBack />
        Back
      </Link>
      <div className="grid grid-cols-3 gap-2">
        <div className="image-container col-span-2 flex">
          <div className="image-carsousel">
            {props.images && props.images.length > 1 ? (
              <div className="image-thumbnails flex flex-col gap-2 mt-2">
                {props.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.image_url}
                    alt={`${props.name} thumbnail ${index + 1}`}
                    className="w-16 h-16 aspect-square object-cover rounded cursor-pointer"
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            ) : null}
          </div>
          <div className="main-image flex justify-start">
            {props.images && props.images.length > 0 ? (
              <img
                src={props.images[currentIndex].image_url}
                alt={props.name}
                className="w-full aspect-video object-contain"
              />
            ) : null}
          </div>
        </div>
        <div className="product-info col-span-1">
          <h2 className="text-2xl font-bold mb-2">{props.name}</h2>
          <p className="text-gray-600 mb-2">{props.description}</p>
          <p className="text-lg font-semibold mb-2">
            Price: ${props.priceRange.highest.toFixed(2)}
          </p>
          <p className="text-gray-600">
            Rating: {props.rating} ({props.reviews} reviews)
          </p>
          <p className="text-gray-600">
            {props.sold > 0 ? "In stock" : "Out of stock"}
          </p>

          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 cursor-pointer mt-4">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
