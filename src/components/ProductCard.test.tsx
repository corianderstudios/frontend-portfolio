import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ProductCard from "./ProductCard";
import { makeProduct } from "../test/productFixture";

describe("ProductCard", () => {
  it("shows product details and the first image", () => {
    const product = makeProduct();

    render(<ProductCard {...product} />);

    expect(screen.getByText("Runner")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Runner" })).toHaveAttribute(
      "src",
      "/blue.jpg",
    );
  });

  it("cycles through the product images", async () => {
    const user = userEvent.setup();
    render(<ProductCard {...makeProduct()} />);
    const image = screen.getByRole("img", { name: "Runner" });

    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(image).toHaveAttribute("src", "/red.jpg");

    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(image).toHaveAttribute("src", "/blue.jpg");

    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(image).toHaveAttribute("src", "/red.jpg");
  });

  it("shows the empty state when the product has no images", () => {
    render(<ProductCard {...makeProduct({ images: [] })} />);

    expect(
      screen.getByRole("heading", { name: "No products found" }),
    ).toBeInTheDocument();
  });
});
