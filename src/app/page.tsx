import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { ProcessSequence } from "@/components/ProcessSequence";
import { SelectedWork } from "@/components/SelectedWork";
import { ServiceCards } from "@/components/ServiceCards";
import { WHATSAPP } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="positioning page-shell" aria-labelledby="positioning-title">
        <p className="eyebrow">Section 01 / Intro</p>
        <h2 id="positioning-title">A website that looks presentable but produces no enquiries is not doing its job.</h2>
        <div className="positioning-answer">
          <p>We design and build the structure, pages, and enquiry path as one system.</p>
          <Link className="text-link" href="/services">See the scope and pricing <span aria-hidden="true">→</span></Link>
        </div>
        <div className="crosshair positioning-cross" aria-hidden="true" />
      </section>
      <HorizontalProjects />
      <SelectedWork />
      <ProcessSequence />
      <section className="services-home page-shell" aria-labelledby="services-home-title">
        <div className="section-heading-row">
          <div><p className="eyebrow">Section 04 / Services</p><h2 id="services-home-title">Clear scope before the first call.</h2></div>
          <p className="section-note">Prices are visible because the starting point should not be a secret.</p>
        </div>
        <ServiceCards />
        <div className="crosshair services-cross" aria-hidden="true" />
      </section>
      <section className="proof page-shell" aria-labelledby="proof-title">
        <div><p className="eyebrow">Section 05 / Proof</p><h2 id="proof-title">Proof without theatre.</h2></div>
        <div className="proof-grid">
          <article><strong>14</strong><p>public pages delivered for the verified 6HRS website.</p></article>
          <article><strong>07</strong><p>responsive routes captured for the jade commerce concept.</p></article>
          <article><strong>10</strong><p>homepage sections reviewed on desktop and mobile for X&Y Clinic.</p></article>
        </div>
        <div className="proof-note">
          <p>No invented testimonials. No unsourced conversion claims. We show the work that exists.</p>
          <a className="button button-secondary" href={WHATSAPP.url} target="_blank" rel="noreferrer">Request a quote <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </>
  );
}
