import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productDetails } from "../product-details";
import ProductDetailPage from "./product-detail-page";

export function generateStaticParams() {
  return productDetails.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productDetails.find(item => item.slug === slug);
  if (!product) notFound();
  return { title: `${product.name} | PurelyPea`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productDetails.find(item => item.slug === slug);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
