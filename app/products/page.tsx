import type { Metadata } from "next";
import ProductsPage from "./products-page";

export const metadata: Metadata = {
  title: "Products | PurelyPea",
  description: "Explore PurelyPea Ragi Milk, Kunnankaya Powder, Pumpkin & Sweet Potato, Dates Powder, and product combos.",
};

export default function Products() { return <ProductsPage />; }
