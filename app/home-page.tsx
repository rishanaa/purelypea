"use client";

import { Artwork, SiteHeader, SiteFooter } from "./site-chrome";
import { products, combos } from "./product-data";
import Link from "next/link";
import { productHref } from "./products/product-details";
import { useEffect, useRef, useState, type CSSProperties } from "react";




export default function HomePage() {
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState<{ title: string; text: string; image?: string } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const comboDrag = useRef({ startX: 0, scrollLeft: 0, active: false, moved: false });
  const featured = useRef<HTMLElement>(null);
  const pouch = useRef<HTMLAnchorElement>(null);
  const product = products[selected];
  useEffect(() => {
    const section = featured.current;
    const artwork = pouch.current;
    if (!section || !artwork) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let floating: Animation | undefined;
    let visible = false;

    function updateFloating() {
      if (reducedMotion.matches) {
        floating?.cancel();
        floating = undefined;
        return;
      }
      if (!visible) {
        floating?.pause();
        return;
      }
      if (!floating) {
        // Keep the same gentle float for every selected product, without an entrance.
        floating = artwork!.animate([
          { transform: "translateY(0)" },
          { transform: "translateY(-3.769841%)" },
        ], { duration: 500, easing: "cubic-bezier(0,0,.58,1)", direction: "alternate", iterations: Infinity });
      } else {
        floating.play();
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateFloating();
    }, { threshold: 0.2 });
    observer.observe(section);
    reducedMotion.addEventListener("change", updateFloating);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updateFloating);
      floating?.cancel();
    };
  }, [selected]);
  function showDetail(title: string, text: string, image?: string) {
    setDetail({ title, text, image });
    dialog.current?.showModal();
  }
  return <>
    <a className="skip-link" href="#products">Skip to products</a>
    <main id="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-surface" />
        <SiteHeader />
        <div className="hero-art"><Artwork name="hero" alt="PurelyPea ragi milk, dates, pumpkin and sweet potato, and kunnankaya food pouches with their ingredients" priority /></div>
        <div className="hero-copy">
          <h1 id="hero-title">Little Spoonfuls.<br />Lots Of Love</h1>
          <Link className="mascot-button shop-button" href="/products"><span className="shop-bear"><Artwork name="shop-bear" /></span><span className="button-face">Shop Now</span><span className="shop-paw"><Artwork name="shop-paw" /></span></Link>
        </div>
      </section>
      <section className="about" id="about" aria-label="About PurelyPea">
        <div className="about-surface" aria-hidden="true">
          <div className="about-bear"><Artwork name="about-bear" /></div>
        </div>
        <h2>More Than Baby Food, We&apos;re Nurturing Healthier Beginnings And Brighter Tomorrows. <a href="/about">About Us</a></h2>
      </section>
      <div className="product-and-combos" style={{ "--product-color": product.color } as CSSProperties}>
        <section className="featured" id="products" aria-labelledby="product-title" ref={featured}>
          <Link className="featured-art" key={product.image} ref={pouch} href={productHref(product.image)} aria-label={`View ${product.name}`}><Artwork name={product.image} alt={`${product.name} pouch`} /></Link>
          <div className="product-information">
            <div className="product-copy" aria-live="polite">
              <h2 id="product-title" className={selected === 1 || selected === 2 ? "long-title" : ""}>{product.name}</h2><p>{product.description}</p>
              <Link className="product-link" href={productHref(product.image)}>View Product</Link>
            </div>
            <div className="product-selector" aria-label="Choose a product">
              {products.map((item, i) => <Link href={productHref(item.image)} key={item.image} className={selected === i ? "product-option selected" : "product-option"} style={{ "--tile-color": item.color } as CSSProperties} aria-label={`View ${item.name}`} onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)}><span className="tile-background" /><Artwork name={`${item.image}-thumb`} /></Link>)}
            </div>
          </div>
        </section>
        <section className="combos" aria-labelledby="combos-title">
          <h2 id="combos-title">Explore<br />Combos</h2>
          <div className="combo-cards" tabIndex={0} role="region" aria-label="Product combos, swipe or scroll horizontally for more"
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              comboDrag.current.moved = false;
              if (event.pointerType !== "mouse" || event.button !== 0) return;
              comboDrag.current = { startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, active: true, moved: false };
            }}
            onPointerMove={(event) => {
              const drag = comboDrag.current;
              if (!drag.active) return;
              const distance = event.clientX - drag.startX;
              if (!drag.moved && Math.abs(distance) < 6) return;
              drag.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = "true";
              event.currentTarget.scrollLeft = drag.scrollLeft - distance;
            }}
            onPointerUp={(event) => {
              comboDrag.current.active = false;
              delete event.currentTarget.dataset.dragging;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={(event) => {
              comboDrag.current.active = false;
              delete event.currentTarget.dataset.dragging;
            }}
            onPointerLeave={() => { if (!comboDrag.current.moved) comboDrag.current.active = false; }}
            onClickCapture={(event) => {
              if (comboDrag.current.moved && event.detail !== 0) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}>
            {combos.map((combo, i) => <Link className="combo-card" key={combo.name} href={productHref(`combo-${i + 1}`)} aria-label={`View ${combo.name}`}><span className="combo-art"><Artwork name={`combo-${i + 1}`} alt={combo.name} /></span><span className="combo-price">Get It For ₹{combo.price} -{combo.discount}%</span></Link>)}
          </div>
        </section>
      </div>
      <section className="recipes" id="recipes" aria-labelledby="recipe-title">
        <div className="recipe-copy"><h2 id="recipe-title">Little Spoons,<br />Tiny Little Tummies. <a className="recipe-cta" href="/recipes">View Recipes</a></h2><p>Turn Your Favourite Purelypea Powders Into Delicious Meals For Your Little One</p></div>
        <div className="recipe-art"><Artwork name="recipe-banner" alt="PurelyPea bear enjoying a bowl of porridge surrounded by food pouches and fresh ingredients" /></div>
      </section>
    </main>
    <SiteFooter showDetail={showDetail} />
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
      {detail?.image && <div className="dialog-art"><Artwork name={detail.image} alt={detail.title} /></div>}
      <h2 id="dialog-title">{detail?.title}</h2><p>{detail?.text}</p>
    </dialog>
  </>;
}
