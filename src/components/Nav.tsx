"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE, WHATSAPP } from "@/lib/content";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const update = () => setSolid(window.scrollY > Math.max(window.innerHeight * 0.82, 520));
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    window.dispatchEvent(new CustomEvent("sya:menu", { detail: open }));
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${pathname !== "/" || solid || open ? "is-solid" : ""}`}>
      <nav className="nav-shell" aria-label="Primary">
        <Link className="wordmark" href="/" onClick={close} aria-label={`${SITE.name}, home`}>
          <Image src="/brand/sya-r-monogram.png" alt="" width={48} height={48} aria-hidden="true" />
          <span>Sya.R Creative Portfolio</span>
        </Link>
        <div className="desktop-nav">
          <div className="desktop-nav-links">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
          </div>
          <a className="nav-cta" href={WHATSAPP.url} target="_blank" rel="noreferrer">
            Start a project <span aria-hidden="true">↗</span>
          </a>
        </div>
        <button
          ref={triggerRef}
          className={`menu-trigger ${open ? "is-open" : ""}`}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </button>
        <div ref={panelRef} id="mobile-menu" className={`mobile-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
          <p className="menu-label">Navigation</p>
          <ul>
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} style={{ "--delay": `${index * 40}ms` } as React.CSSProperties}>
                <Link href={link.href} onClick={close} tabIndex={open ? 0 : -1}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="menu-footer">
            <p>Kuala Lumpur, Malaysia</p>
            <a href={WHATSAPP.url} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>Start a project <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <noscript>
          <div className="nojs-nav">{NAV_LINKS.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div>
        </noscript>
      </nav>
    </header>
  );
}
