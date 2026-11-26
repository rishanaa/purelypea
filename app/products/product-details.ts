import { products } from "../product-data";

const details = [
  { slug: "ragi-milk", price: 879, subtitle: "Finger millet powder", ingredient: "Ragi (finger millet)", packDescription: "A familiar grain for your little one’s everyday meals.", description: "Made from finger millet, PurelyPea Ragi Milk\nhas a gentle flavour and a smooth, creamy\ntexture when prepared." },
  { slug: "pumpkin-sweet-potato", price: 459, subtitle: "Pumpkin & sweet potato powder", ingredient: "Pumpkin & sweet potato", packDescription: "Pumpkin and sweet potato for everyday meals." },
  { slug: "kunnankaya-powder", price: 599, subtitle: "Green banana powder", ingredient: "Kunnankaya (green banana)", packDescription: "Green banana for warm porridges and everyday cooking." },
  { slug: "dates-powder", price: 879, subtitle: "Dates powder", ingredient: "Dates", packDescription: "Date flavour for porridge and everyday favourites." },
];

export const productDetails = products.map((product, index) => ({
  ...product,
  ...details[index],
  description: details[index].description ?? product.description,
  galleryImage: `/images/catalog-${product.image}.webp`,
  weight: "250 g",
}));

export type ProductDetail = typeof productDetails[number];
export function productHref(image: string) {
  const product = productDetails.find(item => item.image === image.replace(/^catalog-/, ""));
  return product ? `/products/${product.slug}` : "/products";
}
