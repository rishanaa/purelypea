"use client";

import Image from "next/image";
import { useState } from "react";

export function Artwork({ name, alt = "", priority = false }: { name: string; alt?: string; priority?: boolean }) {
  const productName = name.replace(/-thumb$/, "");
  const isUpdatedPouch = ["dates", "ragi", "pumpkin"].includes(productName);
  const src = isUpdatedPouch ? `/images/${productName}-pouch-hd.png` : `/images/${name}.webp`;
  return <Image src={src} alt={alt} fill sizes="(max-width: 600px) 100vw, 65vw" priority={priority} unoptimized={isUpdatedPouch} style={isUpdatedPouch ? { objectFit: "contain" } : undefined} />;
}


type SitePage = "home" | "about" | "products" | "recipes" | "contact";
function links(page: SitePage) { return [["Home", page === "home" ? "#home" : "/"], ["Products", "/products"], ["About Us", "/about"], ["Recipes", "/recipes"], ["Contact Us", "/contact"]]; }

export function SiteHeader({ about = false, page = about ? "about" : "home" }: { about?: boolean; page?: SitePage }) {
 const [menuOpen, setMenuOpen] = useState(false);
 const navigation = links(page);
 const activeIndex = page === "contact" ? 4 : page === "recipes" ? 3 : page === "products" ? 1 : page === "about" ? 2 : 0;
 return (        <header className="header">
          <a href={page === "home" ? "#home" : "/"} aria-label="PurelyPea home"><Image src="/images/logo-purely.svg" alt="PurelyPea baby foods" width={140} height={52} priority /></a>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
          <nav id="primary-navigation" className={menuOpen ? "navigation open" : "navigation"} aria-label="Main navigation">
            {navigation.map(([label, href], i) => <a key={href} href={href} className={i === activeIndex ? "active" : ""} aria-current={i === activeIndex ? "page" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
        </header>);
}

export function SiteFooter({ about = false, page = about ? "about" : "home", showDetail }: { about?: boolean; page?: SitePage; showDetail: (title: string, text: string) => void }) {
 const navigation = links(page);
 const activeIndex = page === "contact" ? 4 : page === "recipes" ? 3 : page === "products" ? 1 : page === "about" ? 2 : 0;
 return (    <footer id="contact" className={page === "about" ? "footer footer-about" : "footer"}>
      <a className="footer-logo" href={page === "home" ? "#home" : "/"} aria-label="PurelyPea home"><Image src="/images/logo-purely.svg" alt="PurelyPea baby foods" width={140} height={52} /></a>
      <nav className="footer-navigation" aria-label="Footer navigation">{navigation.slice(0, 4).map(([label, href], i) => <a key={href} href={href} className={i === activeIndex ? "active" : ""} aria-current={i === activeIndex ? "page" : undefined}>{label}</a>)}</nav>
      <div className="help"><h2>Help Desk</h2><a href="/contact" aria-current={page === "contact" ? "page" : undefined}>Contact Us</a>{["Shipping Policy", "Return Policy", "Terms Of Service"].map(label => <button key={label} onClick={() => showDetail(label, "This information will be available when the store services are connected.")}>{label}</button>)}</div>
      <button className="mascot-button subscribe-button" onClick={() => showDetail("Stay in the loop", "Newsletter sign-up is coming soon. The mailing service has not been connected yet.")}><span className="subscribe-bear"><Artwork name="subscribe-bear" /></span><span className="button-face">Subscribe</span></button>
      <div className="socials"><span>Follow Us On</span>{["instagram", "facebook"].map(name => <button key={name} aria-label={`PurelyPea on ${name}`} onClick={() => showDetail("Follow PurelyPea", "Our social profile links will be available soon.")}><Image src={`/images/${name}.svg`} alt="" width={39} height={39} /></button>)}</div>
      <p className="copyright">© all rights reserved purelypea.com</p>
    </footer>);
}
