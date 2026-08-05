import Link from "next/link";
import { FOOTER, NAV_LINKS, SITE, WHATSAPP } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grain" aria-hidden="true" />
      <div className="crosshair footer-cross" aria-hidden="true" />
      <div className="page-shell footer-main">
        <p className="eyebrow">Start a project</p>
        <a className="footer-cta" href={WHATSAPP.url} target="_blank" rel="noreferrer">
          {FOOTER.prompt}<span aria-hidden="true">↗</span>
        </a>
        <a className="footer-number" href={WHATSAPP.url} target="_blank" rel="noreferrer">
          WhatsApp {WHATSAPP.display}
        </a>
      </div>
      <div className="page-shell footer-meta">
        <nav aria-label="Footer">
          {NAV_LINKS.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div>
          <p>{SITE.locality}</p>
          <a href={SITE.url}>{SITE.domain}</a>
        </div>
        <p>{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
