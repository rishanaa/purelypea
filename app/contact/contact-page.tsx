"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { SiteHeader, SiteFooter } from "../site-chrome";
import styles from "./contact.module.css";

const supportEmail = "support@purelypea.com";

export default function ContactPage() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState({ title: "", text: "" });
  const [emailDraft, setEmailDraft] = useState("");

  function showDetail(title: string, text: string) {
    setDetail({ title, text });
    dialog.current?.showModal();
  }

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !subject || !message) {
      const fieldName = !name ? "name" : !subject ? "subject" : "message";
      const field = event.currentTarget.elements.namedItem(fieldName) as HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity("Please enter more than spaces.");
      field.reportValidity();
      return;
    }
    const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
    const draft = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailDraft(draft);
    window.location.href = draft;
  }

  return <>
    <a className="skip-link" href="#contact-form">Skip to contact form</a>
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroBackground} aria-hidden="true" />
        <SiteHeader page="contact" />
        <div className={styles.heroCopy}>
          <h1 id="contact-title">Contact us</h1>
          <p>Questions about a product or your order?</p>
          <p>We’d love to hear from you.</p>
        </div>
        <div className={styles.wave} aria-hidden="true" />
        <div className={styles.bearDesktop}><Image src="/images/contact-bear-desktop.webp" alt="PurelyPea bear waving hello" fill sizes="28vw" priority /></div>
        <div className={styles.bearMobile}><Image src="/images/contact-bear-desktop.webp" alt="PurelyPea bear waving hello" fill sizes="233px" priority /></div>
      </section>
      <div className={styles.content}>
        <section className={styles.support} aria-labelledby="support-title">
          <h2 id="support-title">Email us</h2>
          <p className={styles.supportDescription}>Prefer to email us directly?</p>
          <a className={styles.email} href={`mailto:${supportEmail}`}>{supportEmail}</a>
          <h3>Asking about an order?</h3>
          <p className={styles.orderNote}>Include your order number so we<br />can find the details.</p>
        </section>
        <form id="contact-form" className={styles.form} aria-labelledby="form-title" onSubmit={prepareMessage}
          onInput={event => {
            const target = event.target;
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.setCustomValidity("");
            if (emailDraft) setEmailDraft("");
          }}>
          <h2 id="form-title">Send us a message</h2>
          <div className={styles.identity}>
            <div className={styles.field}>
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={120} />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Your email address" required maxLength={254} />
            </div>
          </div>
          <div className={`${styles.field} ${styles.subject}`}>
            <label htmlFor="contact-subject">Subject</label>
            <input id="contact-subject" name="subject" placeholder="What is your message about?" required maxLength={200} />
          </div>
          <div className={`${styles.field} ${styles.message}`}>
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" placeholder="Write your message here" required maxLength={4000} />
          </div>
          <button className={styles.send} type="submit" title="Open your email app to review and send this message">Send message</button>
          {emailDraft && <p className={styles.status} role="status">Finish sending in your email app. If it didn’t open, <a href={emailDraft}>open your email draft</a> or email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>}
        </form>
      </div>
    </main>
    <SiteFooter page="contact" showDetail={showDetail} />
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="contact-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="contact-dialog-title">{detail.title}</h2><p>{detail.text}</p>
    </dialog>
  </>;
}
