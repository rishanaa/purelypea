import type { Metadata } from "next";
import RecipesPage from "./recipes-page";

export const metadata: Metadata = {
  title: "Recipes | PurelyPea",
  description: "Make banana ragi pancakes, apple and dates mini cakes, pumpkin and sweet potato cutlets, and kunnankaya mini idlis with PurelyPea.",
};

export default function Recipes() { return <RecipesPage />; }
