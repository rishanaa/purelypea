"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SiteHeader, SiteFooter } from "../site-chrome";
import { products, combos } from "../product-data";
import styles from "./products.module.css";
import { productHref } from "./product-details";

const catalog = [products[0], products[2], products[1], products[3]].map((product, index) => ({
  ...product,
  price: [879, 599, 459, 879][index],
  discount: [17, 12, 13, 17][index],
  image: `catalog-${product.image}`,
  slot: [[43, 46, 262, 382], [48, 49, 254, 378], [45, 38, 262, 382], [55, 55, 262, 382]][index],
}));
const selectorOrder = [0, 2, 1, 3];
const heroTitles = [["Ragi Milk", "Powder"], ["Kunnankaya", "Powder"], ["Pumpkin &", "Sweet Potato"], ["Dates", "Powder"]];
type Detail = { title: string; text: string; image?: string; price?: number; discount?: number };

function ProductRail({ children, label, grid = false }: { children: ReactNode; label: string; grid?: boolean }) {
  const drag = useRef({ start: 0, scroll: 0, active: false, moved: false });
  return <div className={`${styles.rail} ${grid ? styles.grid : ""}`} role="region" aria-label={label} tabIndex={0}
    onDragStart={event => event.preventDefault()}
    onKeyDown={event => {
      if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      event.currentTarget.scrollBy({ left: event.currentTarget.clientWidth * (event.key === "ArrowRight" ? 0.8 : -0.8) });
    }}
    onPointerDown={event => {
      drag.current.moved = false;
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft, active: true, moved: false };
    }}
    onPointerMove={event => {
      if (!drag.current.active) return;
      const distance = event.clientX - drag.current.start;
      if (!drag.current.moved && Math.abs(distance) < 6) return;
      drag.current.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.scrollLeft = drag.current.scroll - distance;
    }}
    onPointerUp={event => {
      drag.current.active = false;
      delete event.currentTarget.dataset.dragging;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={event => { drag.current.active = false; delete event.currentTarget.dataset.dragging; }}
    onPointerLeave={() => { if (!drag.current.moved) drag.current.active = false; }}
    onClickCapture={event => {
      if (drag.current.moved && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
    }}>
    {children}
  </div>;
}

function Card({ name, image, price, discount, color, slot, href }: {
  name: string; image: string; price: number; discount: number; color: string; slot: number[]; href: string;
}) {
  const [left, top, width, height] = slot;
  return <Link href={href} className={styles.card} style={{ "--card-color": color } as CSSProperties}
    aria-label={`View ${name}, ₹${price}, ${discount}% off`}>
    <span className={styles.art}>
      <Image src={`/images/${image}.webp`} alt={name} width={width} height={height}
        sizes="(max-width: 600px) 200px, 28vw" draggable={false}
        style={{ left: `${left / 351 * 100}%`, top: `${top / 462 * 100}%`, width: `${width / 351 * 100}%`, height: `${height / 462 * 100}%` }} />
    </span>
    <span className={styles.price}>Get It For ₹{price} -{discount}%</span>
  </Link>;
}

export default function ProductsPage() {
  const [selected, setSelected] = useState(1);
  const [detail, setDetail] = useState<Detail>({ title: "", text: "" });
  const dialog = useRef<HTMLDialogElement>(null);
  const featured = catalog[selected];
  function openDetail(next: Detail) { setDetail(next); dialog.current?.showModal(); }
  function showDetail(title: string, text: string) { openDetail({ title, text }); }

  return <>
    <a className="skip-link" href="#all-products">Skip to all products</a>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="featured-product-title" style={{ "--featured-color": featured.color } as CSSProperties}>
        <SiteHeader page="products" />
        <div className={styles.heroCopy} aria-live="polite">
          <p>Best To Introduce First</p>
          <h1 id="featured-product-title">{heroTitles[selected][0]}<br />{heroTitles[selected][1]}</h1>
        </div>
        <a className={styles.featuredImage} aria-label={`View featured ${featured.name}`} href={productHref(featured.image)}>
          <Image src={`/images/${selected === 1 ? "catalog-hero-banana" : featured.image}.webp`} alt={`${featured.name} pouch`} fill sizes="(max-width: 600px) 158px, 22vw" priority />
        </a>
        <div className={styles.selector} role="group" aria-label="Choose featured product">
          {selectorOrder.map(index => <button key={catalog[index].image} className={styles.option} aria-pressed={selected === index}
            aria-label={`Show ${catalog[index].name}`} onClick={() => setSelected(index)}>
            <Image src={`/images/${catalog[index].image}.webp`} alt="" fill sizes="(max-width: 600px) 70px, 10vw" />
          </button>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.combos}`} aria-labelledby="combos-title">
        <h2 id="combos-title">Explore Combos</h2>
        <ProductRail label="Product combos, swipe or use arrow keys to browse">
          {combos.map((combo, index) => <Card key={combo.name} {...combo} image={`combo-${index + 1}`} color={["#fc666d1a", "#a5c0011a", "#ffa9081a", "#b64f1e1a"][index]} slot={[12, 33, 326, 408]}
            href={productHref(`combo-${index + 1}`)} />)}
        </ProductRail>
      </section>

      <section className={`${styles.section} ${styles.age}`} aria-labelledby="six-month-title">
        <h2 id="six-month-title">6 Month +</h2>
        <ProductRail label="6 Month Plus products, swipe or use arrow keys to browse">
          {catalog.map(product => <Card key={product.image} {...product} href={productHref(product.image)} />)}
        </ProductRail>
      </section>

      <section className={`${styles.section} ${styles.all}`} id="all-products" aria-labelledby="all-products-title">
        <h2 id="all-products-title">All Products</h2>
        <ProductRail label="All products" grid>
          {catalog.map(product => <Card key={product.image} {...product} color="#4aa1b91a"
            slot={product.image === "catalog-dates" ? [49, 61, 253, 369] : product.slot} href={productHref(product.image)} />)}
        </ProductRail>
      </section>
    </main>
    <SiteFooter page="products" showDetail={showDetail} />
    <dialog className={`detail-dialog ${styles.dialog}`} ref={dialog} aria-labelledby="catalog-dialog-title"
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
      {detail.image && <div className="dialog-art"><Image src={`/images/${detail.image}.webp`} alt={detail.title} fill sizes="300px" /></div>}
      <h2 id="catalog-dialog-title">{detail.title}</h2>
      <p>{detail.text}</p>
      {detail.price !== undefined && <p className={styles.dialogPrice}>₹{detail.price} · {detail.discount}% off</p>}
    </dialog>
  </>;
}
