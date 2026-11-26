import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "PurelyPea | Little spoonfuls. Lots of love.",
  description: "Discover PurelyPea baby foods, wholesome powders, little meal ideas, and your favourite combos.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
