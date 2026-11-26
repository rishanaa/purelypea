import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About Us | PurelyPea",
  description: "Familiar ingredients for your little one’s first bites. Discover the story behind PurelyPea and the foods that bring families together.",
};
export default function About() { return <AboutPage />; }
