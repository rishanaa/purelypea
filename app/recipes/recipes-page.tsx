"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { SiteHeader, SiteFooter } from "../site-chrome";
import { recipes } from "./recipe-data";
import styles from "./recipes.module.css";

export default function RecipesPage() {
  const [turn, setTurn] = useState(0);
  const selected = ((turn % recipes.length) + recipes.length) % recipes.length;
  const recipe = recipes[selected];
  const drag = useRef({ x: 0, y: 0, active: false, moved: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState({ title: "", text: "" });

  function showDetail(title: string, text: string) {
    setDetail({ title, text });
    dialog.current?.showModal();
  }

  function choose(index: number) {
    let distance = (index - selected + recipes.length) % recipes.length;
    if (distance > 2) distance -= recipes.length;
    setTurn(current => current + distance);
  }

  return <>
    <a className="skip-link" href="#recipe-details">Skip to recipe</a>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="recipes-title">
        <SiteHeader page="recipes" />
        <h1 id="recipes-title">What Shall We Make Today?</h1>
        <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Choose a recipe, swipe or use arrow keys" tabIndex={0}
          onKeyDown={event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            setTurn(current => current + (event.key === "ArrowRight" ? 1 : -1));
          }}
          onDragStart={event => event.preventDefault()}
          onPointerDown={event => {
            if (event.button !== 0) return;
            drag.current = { x: event.clientX, y: event.clientY, active: true, moved: false };
          }}
          onPointerMove={event => {
            const gesture = drag.current;
            if (!gesture.active) return;
            const dx = event.clientX - gesture.x;
            const dy = event.clientY - gesture.y;
            if (Math.abs(dy) > Math.abs(dx) && !gesture.moved) { gesture.active = false; return; }
            if (Math.abs(dx) > 10) {
              gesture.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }
          }}
          onPointerUp={event => {
            const gesture = drag.current;
            if (gesture.active && gesture.moved && Math.abs(event.clientX - gesture.x) > 35) {
              setTurn(current => current + (event.clientX < gesture.x ? 1 : -1));
            }
            gesture.active = false;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { drag.current.active = false; }}
          onPointerLeave={() => { if (!drag.current.moved) drag.current.active = false; }}
          onClickCapture={event => {
            if (drag.current.moved && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
          }}>
          <div className={styles.wheel} style={{ "--rotation": `${-turn * 90}deg` } as CSSProperties}>
            {recipes.map((item, index) => <button key={item.image} className={styles.dish} data-position={index}
              aria-label={`${index === selected ? "Read" : "Show"} ${item.name}`} aria-pressed={index === selected}
              tabIndex={index === selected || (index - selected + 4) % 4 !== 2 ? 0 : -1}
              onClick={() => {
                if (index === selected) document.getElementById("recipe-details")?.scrollIntoView({ block: "start" });
                else choose(index);
              }}>
              <Image src={item.image} alt={item.name} fill sizes="(max-width: 600px) 33vw, 33vw" priority draggable={false} />
            </button>)}
          </div>
          <button className={`${styles.direction} ${styles.previous}`} aria-label="Previous recipe" onClick={() => setTurn(current => current - 1)} />
          <button className={`${styles.direction} ${styles.next}`} aria-label="Next recipe" onClick={() => setTurn(current => current + 1)} />
          <a className={styles.caption} data-long={selected === 1 || undefined} href="#recipe-details" aria-live="polite">{recipe.name}</a>
        </div>
      </section>
      <article id="recipe-details" className={styles.details} aria-labelledby="recipe-name">
        <section className={styles.recipeIntro}>
          <div className={styles.plate}><Image src={recipe.image} alt={recipe.name} fill sizes="(max-width: 600px) 256px, 59vw" /></div>
          <div className={styles.curvedArrow}><Image className={styles.desktopArrow} src="/images/recipe-arrow.svg" alt="" fill /><Image className={styles.mobileArrow} src="/images/recipe-arrow-mobile.svg" alt="" fill /></div>
          <div className={styles.leaf}><Image src="/images/recipe-leaf.svg" alt="" fill /></div>
          <div className={styles.greenBurst}><Image src="/images/recipe-burst-green.svg" alt="" fill /></div>
          <h2 id="recipe-name">{recipe.name}</h2>
        </section>
        <section className={styles.ingredients} aria-labelledby="ingredients-title">
          <div className={styles.ingredientCopy}>
            <h2 id="ingredients-title">Ingredients</h2>
            <p>{recipe.description}</p>
          </div>
          <table>
            <thead><tr><th scope="col">Ingredient</th><th scope="col">Quantity</th></tr></thead>
            <tbody>{recipe.ingredients.map(([ingredient, quantity]) => <tr key={ingredient}><td>{ingredient}</td><td>{quantity}</td></tr>)}</tbody>
          </table>
        </section>
        <section className={styles.preparation} aria-labelledby="preparation-title">
          <div className={styles.wave} aria-hidden="true"><Image src="/images/recipe-wave.svg" alt="" fill /></div>
          <div className={styles.orangeBurst}><Image src="/images/recipe-burst-orange.svg" alt="" fill /></div>
          <h2 id="preparation-title">Preparation</h2>
          <ol>{recipe.steps.map(step => <li key={step}>{step}</li>)}</ol>
        </section>
      </article>
    </main>
    <SiteFooter page="recipes" showDetail={showDetail} />
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="recipe-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="recipe-dialog-title">{detail.title}</h2><p>{detail.text}</p>
    </dialog>
  </>;
}
