import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import ProductDetails from "./ProductDetails";
import { makeProduct } from "../test/productFixture";

describe("ProductDetails", () => {
  it("places the Back link above the product content", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductDetails {...makeProduct()} />
      </MemoryRouter>,
    );

    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    if (!section) throw new Error("Product details section was not rendered");

    const backLink = within(section).getByRole("link", { name: "Back" });
    const content = section.querySelector(".grid");

    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink.nextElementSibling).toBe(content);
  });

  it("constrains the main product image to a square without cropping", () => {
    render(
      <MemoryRouter>
        <ProductDetails {...makeProduct()} />
      </MemoryRouter>,
    );

    const mainImage = screen.getByRole("img", { name: "Runner" });

    expect(mainImage).toHaveAttribute("src", "/blue.jpg");
    expect(mainImage).toHaveClass("aspect-square", "object-cover", "max-h-full");
  });

  it("changes the main image when a thumbnail is selected", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductDetails {...makeProduct()} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("img", { name: "Runner thumbnail 2" }));

    expect(screen.getByRole("img", { name: "Runner" })).toHaveAttribute(
      "src",
      "/red.jpg",
    );
  });
});
