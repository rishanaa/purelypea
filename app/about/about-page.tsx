"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Artwork, SiteHeader, SiteFooter } from "../site-chrome";
import styles from "./about.module.css";

// Copy and artwork from the supplied PurelyPea.fig About frames (2128:184 / 2254:2387).
const stories = [
  {
    "text": "You hold out that first spoonful and wait. There’s a pause, a puzzled little face, and then, if you’re lucky, a mouth opening for more. When you’re the one holding the spoon, that tiny moment feels like a big deal.\nThat’s the moment behind Purelypea. We wanted to make it easier for families to share the foods many of us grew up eating, even on the days when there’s hardly time to sit down. We started with ingredients we already knew and loved, and found simpler ways to bring them to the table",
    "image": "first-spoonful",
    "alt": "It started with a little spoonful: Ragi Milk and a bowl of porridge"
  },
  {
    "text": "Ragi, kunnankaya, pumpkin, sweet potato, and dates already have a place in many family kitchens. They’re the starting point for our Ragi Milk, Kunnankaya Powder, Pumpkin & Sweet Potato, and Dates Powder. These are familiar flavours you can make part of your own family’s mealtime routine",
    "image": "ingredients",
    "alt": "Familiar ingredients: pumpkin, sweet potato and a PurelyPea pouch"
  },
  {
    "text": "Some mornings, you have time to make porridge slowly. Other mornings, you’re holding your little one with one arm and getting breakfast ready with the other. We make our foods easy to prepare because nourishing your little one should fit into both kinds of days",
    "image": "family-days",
    "alt": "Made for real family days: a parent feeding a child beside Dates Powder"
  },
  {
    "text": "One day, the little one you’re feeding now might ask for the porridge they remember eating at home. We’d love to be part of that memory. That’s our hope for Purelypea: to help a generation grow up with familiar, nourishing food they’ll enjoy coming back to",
    "image": "growing",
    "alt": "What we’re growing toward: a child tending a plant beside Kunnankaya Powder"
  }
];

export default function AboutPage() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState({ title: "", text: "" });
  function showDetail(title: string, text: string) {
    setDetail({ title, text });
    dialog.current?.showModal();
  }
  return <>
    <a className="skip-link" href="#about-content">Skip to about content</a>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <SiteHeader about />
        <h1 id="about-title">Familiar Ingredients For Your Little One’s First Bites</h1>
        <div className={styles.pouches} aria-hidden="true">
          <div className={styles.banana}><Artwork name="about-banana" priority /></div>
          <div className={styles.pumpkin}><Artwork name="about-pumpkin" priority /></div>
          <div className={styles.ragi}><Artwork name="about-ragi" priority /></div>
        </div>
        <Image className={styles.burst} src="/images/about-burst.svg" alt="" width={54} height={67} />
        <Image className={styles.leaf} src="/images/about-leaf.svg" alt="" width={59} height={59} />
      </section>
      <section className={styles.intro} id="about-content" aria-labelledby="story-title">
        <Image src="/images/about-story.webp" alt="" width={1280} height={994} sizes="100vw" />
        <div className={styles.accessibleCopy}>
          <h2 id="story-title">Why We Started PurelyPea.</h2>
          <p>There’s a moment when you hold out that first little spoonful and wait. You watch their face, wondering if they’ll take another bite. It’s such a small thing, but when you’re the one holding the spoon, it feels like a big deal.</p>
          <p>That moment is at the heart of PurelyPea. We wanted to make it easier for families to share the foods many of us grew up with, like ragi and banana, even on the busiest days. So we took familiar ingredients and made them simpler to prepare for little ones.</p>
          <p>We started with a hope that still guides us today. We want more children to grow up enjoying nourishing food, one little spoonful at a time.</p>
        </div>
      </section>
      <div className={styles.stories}>
        {stories.map((story, index) => <section key={story.image} className={styles.story} aria-label={["Our beginning", "Familiar ingredients", "Real family days", "Growing together"][index]}>
          <Image className={styles.illustration} src={"/images/about-" + story.image + ".webp"} alt={story.alt} width={624} height={728} sizes="(max-width: 600px) 100vw, 50vw" />
          <p>{story.text}</p>
        </section>)}
      </div>
    </main>
    <SiteFooter about showDetail={showDetail} />
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="about-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="about-dialog-title">{detail.title}</h2><p>{detail.text}</p>
    </dialog>
  </>;
}
