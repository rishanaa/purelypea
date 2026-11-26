"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { SiteHeader, SiteFooter } from "../../site-chrome";
import { productDetails, type ProductDetail } from "../product-details";
import styles from "./product-detail.module.css";

type CartItem = { slug: string; quantity: number };
const cartKey = "purelypea-cart";

function readCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(cartKey) ?? "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is CartItem => !!item && typeof item === "object" &&
      productDetails.some(product => product.slug === item.slug) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99);
  } catch { return []; }
}

export default function ProductDetailPage({ product }: { product: ProductDetail }) {
  const cartDialog = useRef<HTMLDialogElement>(null);
  const detailDialog = useRef<HTMLDialogElement>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartMessage, setCartMessage] = useState("");
  const [detail, setDetail] = useState({ title: "", text: "" });
  const total = cart.reduce((sum, item) => sum + (productDetails.find(product => product.slug === item.slug)?.price ?? 0) * item.quantity, 0);

  function saveCart(next: CartItem[]) {
    setCart(next);
    try {
      localStorage.setItem(cartKey, JSON.stringify(next));
      setCartMessage("Your cart is saved on this device. Online checkout is not available yet.");
    } catch {
      setCartMessage("Your cart is available for this visit. Online checkout is not available yet.");
    }
  }
  function addToCart() {
    const current = cart.length ? cart : readCart();
    const existing = current.find(item => item.slug === product.slug);
    saveCart(existing
      ? current.map(item => item.slug === product.slug ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item)
      : [...current, { slug: product.slug, quantity: 1 }]);
    cartDialog.current?.showModal();
  }
  function changeQuantity(slug: string, quantity: number) {
    saveCart(quantity <= 0 ? cart.filter(item => item.slug !== slug) : cart.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, quantity) } : item));
  }
  function showDetail(title: string, text: string) {
    setDetail({ title, text });
    detailDialog.current?.showModal();
  }

  return <>
    <a className="skip-link" href="#product-name">Skip to product details</a>
    <main className={styles.page}>
      <div className={styles.navigation}><SiteHeader page="products" /></div>
      <section className={styles.product} aria-labelledby="product-name">
        <div className={styles.gallery} style={{ "--gallery-color": product.color } as CSSProperties}>
          <div className={styles.backdrop} />
          <div className={styles.pouch}><Image src={product.galleryImage} alt={`${product.name} ${product.weight} pouch`} fill sizes="(max-width: 600px) 60vw, 29vw" priority /></div>
        </div>
        <div className={styles.summary}>
          <h1 id="product-name">{product.name}</h1>
          <p className={styles.packSize}>{product.subtitle} <span>·</span> {product.weight}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.price}>₹{product.price}</p>
          <button className={styles.addToCart} onClick={addToCart}>Add to cart</button>
          {cart.length > 0 && <button className={styles.viewCart} onClick={() => cartDialog.current?.showModal()}>View cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>}
        </div>
      </section>
      <section className={styles.information} aria-labelledby="inside-title">
        <h2 id="inside-title">Inside the pack</h2>
        <p>{product.packDescription}</p>
        <div className={styles.cards}>
          <div className={styles.infoCard}><h3>Ingredient</h3><p>{product.ingredient}</p></div>
          <div className={styles.infoCard}><h3>Made without</h3><p>Added sugar or preservatives</p></div>
          <div className={styles.infoCard}><h3>Storage</h3><p>Keep in a cool, dry place</p></div>
        </div>
      </section>
    </main>
    <SiteFooter page="products" showDetail={showDetail} />
    <dialog className={`detail-dialog ${styles.cartDialog}`} ref={cartDialog} aria-labelledby="cart-title" onClick={event => { if (event.target === event.currentTarget) cartDialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close cart" onClick={() => cartDialog.current?.close()}>×</button>
      <h2 id="cart-title">Your cart</h2>
      <p className={styles.cartNote} role="status">{cartMessage}</p>
      {cart.length ? <>
        <ul className={styles.cartItems}>{cart.map(item => {
          const itemProduct = productDetails.find(product => product.slug === item.slug)!;
          return <li key={item.slug}>
            <Image src={itemProduct.galleryImage} alt="" width={52} height={76} />
            <div><a href={`/products/${item.slug}`}>{itemProduct.name}</a><p>₹{itemProduct.price * item.quantity}</p>
              <div className={styles.quantity}>
                <button aria-label={`Decrease ${itemProduct.name} quantity`} onClick={() => changeQuantity(item.slug, item.quantity - 1)}>−</button>
                <output aria-label={`${itemProduct.name} quantity`}>{item.quantity}</output>
                <button aria-label={`Increase ${itemProduct.name} quantity`} disabled={item.quantity >= 99} onClick={() => changeQuantity(item.slug, item.quantity + 1)}>+</button>
                <button className={styles.remove} onClick={() => changeQuantity(item.slug, 0)} aria-label={`Remove ${itemProduct.name}`}>Remove</button>
              </div>
            </div>
          </li>;
        })}</ul>
        <p className={styles.subtotal}>Subtotal: ₹{total}</p>
      </> : <p>Your cart is empty.</p>}
      <Link className={styles.continueShopping} href="/products" onClick={() => cartDialog.current?.close()}>Continue shopping</Link>
    </dialog>
    <dialog className="detail-dialog" ref={detailDialog} aria-labelledby="product-dialog-title" onClick={event => { if (event.target === event.currentTarget) detailDialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => detailDialog.current?.close()}>×</button>
      <h2 id="product-dialog-title">{detail.title}</h2><p>{detail.text}</p>
    </dialog>
  </>;
}
