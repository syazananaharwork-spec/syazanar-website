import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { WHATSAPP } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Request a website quote from Sya.R on WhatsApp." };

export default function ContactPage() {
  return (
    <div className="inner-page contact-page">
      <header className="page-intro page-shell"><p className="eyebrow">Contact / Request a quote</p><h1>Tell us what the website needs to do.</h1><p>Share the business, the likely tier, and the job the site must handle. We will open a prefilled WhatsApp message for you to review.</p><a className="contact-number" href={WHATSAPP.url} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP.display} <span aria-hidden="true">↗</span></a></header>
      <section className="contact-form-section page-shell" aria-labelledby="enquiry-title"><div><p className="eyebrow">Five fields</p><h2 id="enquiry-title">Start with the useful details.</h2></div><ContactForm /></section>
    </div>
  );
}
