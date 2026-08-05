import type { Metadata } from "next";
import { ServiceCards } from "@/components/ServiceCards";

export const metadata: Metadata = { title: "Services", description: "Compare Sya.R website tiers from RM2,250 to custom system builds." };

export default function ServicesPage() {
  return (
    <div className="inner-page">
      <header className="page-intro page-shell"><p className="eyebrow">Services / Pricing</p><h1>Compare every tier in one minute.</h1><p>Choose by the number of pages, the enquiry path, and the systems the site must connect to.</p></header>
      <section className="services-page page-shell" aria-label="Website service tiers"><ServiceCards detailed /></section>
      <section className="custom-examples page-shell"><p className="eyebrow">Custom integration examples</p><h2>When the website must do more than publish pages.</h2><ul><li>Booking and availability</li><li>Online payment</li><li>CRM routing</li><li>Business-system integrations</li></ul></section>
    </div>
  );
}
