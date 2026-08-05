import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/lib/content";

export const metadata: Metadata = { title: "About", description: "How Sya.R designs and builds websites as one commercial system." };

export default function AboutPage() {
  return (
    <div className="inner-page about-page">
      <header className="page-intro page-shell"><p className="eyebrow">About / Studio</p><h1>{ABOUT.title}</h1><p>We build custom websites and digital systems for Malaysian SMEs.</p></header>
      <section className="about-statement page-shell"><p className="eyebrow">A website is infrastructure, not fireworks.</p>{ABOUT.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
      <section className="about-principles page-shell"><article><span>01</span><h2>One system</h2><p>Strategy, pages, design, build, and enquiry flow are considered together.</p></article><article><span>02</span><h2>Direct access</h2><p>You work directly with the studio making the decisions and writing the code.</p></article><article><span>03</span><h2>Visible scope</h2><p>Pricing starts in public. Additions are discussed before they become work.</p></article></section>
      <div className="page-shell about-cta"><Link className="button button-primary" href="/contact">Tell us what you need <span aria-hidden="true">→</span></Link></div>
    </div>
  );
}
