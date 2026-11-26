import type { Metadata } from "next";
import ContactPage from "./contact-page";

export const metadata: Metadata = {
  title: "Contact Us | PurelyPea",
  description: "Get in touch with PurelyPea for help with a product or your order. Email support@purelypea.com or prepare a message using our contact form.",
};

export default function Contact() { return <ContactPage />; }
