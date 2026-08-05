# Reference site audit — creativemarketing.peachweb.io

Inspected live in-browser (screenshots, computed styles, DOM structure, network requests) against this repo's codebase, to extract principles worth adapting into the Syazanar site — not elements to copy verbatim.

Date: 2026-08-05

---

## 1. Platform / stack

- Built on a site-builder called **Peachweb** — all classes prefixed `pwb-`/`pw-`, markup is generated (not hand-authored), main bundle is a minified webpack chunk with no exposed global libraries (`window.gsap`, `window.THREE`, `window.Lenis` etc. all `undefined`). Animation runs through the builder's own internal runtime.
- Confirmed **Three.js + Draco-compressed glTF** via network requests: `draco/draco_decoder.wasm`, `draco/draco_wasm_wrapper.js`, `scene-state/<uuid>.json`. This drives a single fixed, full-viewport `<canvas>`.
- No native CSS `scroll-behavior: smooth` (computed value is `auto`); no dedicated scroll-container div with `overflow: scroll`. Long-distance programmatic jumps (`scrollTo`, `scrollIntoView`) intermittently produced blank/white captures during inspection — likely the fixed WebGL canvas needing continuous scroll-linked frames to stay in a "good" render state, not something to imitate.

## 2. Typography

Font: **DM Sans** everywhere. Consistently tight-to-extreme negative tracking on display sizes, consistently wide positive tracking on small uppercase labels.

| Role | Size | Line-height | Letter-spacing | Weight | Case |
|---|---|---|---|---|---|
| Hero H1 | 64px | 64px (1:1) | -1.92px | 500 | sentence |
| Section H1 | 48px | 52.8px (1.1) | -1.44px | 500 | sentence |
| Card H3 | 28px | 33.6px (1.2) | -0.84px | 500 | sentence |
| Eyebrow label (h4) | 12px | 12px (1:1) | +3.6px (≈0.3em) | 500 | UPPERCASE |
| Body / nav text | 16px | 16px (1:1) | -0.48px | 300 | sentence |

Pattern: **tracking tightens as size increases, and reverses hard (wide, positive) only for the small uppercase eyebrow/kicker labels.** Root `html` font-size is a plain 16px — no fluid/clamp scaling detected at the html level, sizing is done per-element.

## 3. Color palette

Pulled from `:root` custom properties (44 total, all named as opaque style-ids by the builder, values below are what mattered):

- Base neutrals: `#000000` (black), `#ffffff` (white), `#f8f1f1` and `#ebe9e5` (warm off-whites), `#1a1a1a`, `#d9d9d9`.
- Glass/overlay alphas: `#ffffff0f`, `#ffffff66`, `#ffffffb3`, `#ffffff80` (white at ~6%/40%/70%/50%), `#0000004d`, `#0000001a` (black at ~30%/10%).
- One accent gradient family, warm orange/amber, used sparingly (hero image tones, not flooded across the UI): `#ffd6b2 → #ff8a50 → #ffd278 → #ff7600 → #cc4e2b`.

Principle: **restrained black/white/off-white base + a single warm accent family, deployed thinly** (buttons, gradient overlays) rather than as large color blocks.

### 3a. Adapted for Stellar Rise brand ("Noir & Gold")

The reference's *structure* (neutral black/white/off-white base + one warm accent, used thinly) maps cleanly onto Stellar Rise's confirmed palette — no orange/amber needed, the accent role is simply played by champagne gold instead. Source: `01_Business Assets/02_Branding & Identity/Stellar_Rise_Colour_Options.html` ("Noir & Gold — Confirmed Palette").

| Reference role | Reference value | Stellar Rise replacement | Role |
|---|---|---|---|
| Black base | `#000000` | `#0A0A0F` Pure Black | Page background |
| Secondary dark surface | `#1a1a1a` | `#1A1A1A` Dark Charcoal | Cards, nav bar, footer, headings |
| Off-white / cream | `#f8f1f1`, `#ebe9e5` | `#FAF6F0` Cream | Light-mode background, light text-on-dark |
| — (no equivalent) | — | `#B0A898` Warm Silver | Secondary/muted accent — taglines, dividers, supporting text |
| Warm accent family | `#ffd6b2 → #ff7600 → #cc4e2b` (5-stop gradient) | `#D4AF6A` Champagne Gold | Single accent — buttons, links, hover states, borders |
| White-alpha glass overlays | `#ffffff0f/66/b3/80` | `color-mix(in srgb, #FAF6F0 6%/40%/70%/50%, transparent)` | Same glass technique, recomputed from Cream instead of pure white |
| Black-alpha glass overlays | `#0000004d/1a` | `color-mix(in srgb, #0A0A0F 30%/10%, transparent)` | Same technique, from Pure Black |

Two differences worth calling out, not smoothing over:
- The reference uses a **5-stop gradient** as its accent; Stellar Rise has **one flat accent (Gold) plus one muted secondary (Warm Silver)**, no gradient. Simulating a gradient by blending Gold and Silver would manufacture a design decision Stellar Rise hasn't made — better to keep the accent flat and reserve Warm Silver for the secondary/muted role it's already assigned (taglines, dividers), matching the confirmed usage doc.
- The reference's off-white is slightly pink-warm (`#f8f1f1`); Stellar Rise's Cream (`#FAF6F0`) is yellow-warm. Close enough in structure (both are warm off-whites, not clinical white) that the same layering logic applies without adjustment.

This repo's existing `globals.css` tokens (`--accent: #e8a33d`, `--metal-1/2`) belong to the *Syazanar Website Design* sub-brand, not Stellar Rise itself — treat the table above as the palette to use only where a page should carry Stellar Rise's own identity (e.g. a Stellar Rise-branded case study or the agency's own site), not as a blanket replacement of Syazanar's tokens.

## 4. Hero composition

- Full-bleed blurred product photograph (macro, warm-toned) as the visual, with a black→transparent→orange vertical gradient overlay so white text stays legible top-to-bottom without a solid scrim.
- Headline (64px) top-left-anchored in the lower-left two-thirds of the viewport, short 2–3 line wrap, `line-height: 1`.
- Secondary copy block bottom-right, smaller (16px), paired with two CTAs ("Get Started" solid white pill, "Discover More" translucent grey pill) side-by-side.
- Social proof strip ("Trusted by 10k+ businesses" + stacked avatar circles) sits directly under the headline, small, understated — not a hero-dominating element.

## 5. Fixed background / section transitions ("black-to-light")

- The `pwb-scene` canvas is `position: fixed`, sits low in paint order, and **persists across the whole page** rather than being scoped to the hero section alone.
- Content sections do not each carry their own background color; instead, the fixed canvas's own lighting/exposure shifts as scroll progresses (dark and warm at the top, passing through a bright/white-lit passage lower down), and each section's **text color is chosen to stay legible against whatever the canvas looks like at that scroll depth** (white text early, dark text on plain white later).
- This means the "transition" is not a CSS gradient between two fixed colors — it's one continuously-rendered 3D layer whose exposure is the transition.

## 6. Header behavior

- `position: fixed`, top of stack, transparent over the hero image.
- Confirmed via mid-scroll screenshot: flips to a **solid white bar** with the wordmark rendered in a faded/lighter tone and a **solid black pill CTA** once scrolled past the hero. Classic "transparent-over-hero → solid-on-scroll" header, implemented as a discrete state change rather than a gradual fade (evidenced by the crisp white bar edge in the captured frame).

## 7. Menu (mobile)

- Hamburger icon (black rounded-square button, 38×38) sits top-right, replaces the desktop nav links below ~768px.
- Tapping it does **not** open a fullscreen takeover. It drops a **rounded white card panel** from just under the header, hero image still visible (dimmed) in the strip below the card.
- Panel content: nav links (Solutions, Features, AI Power, Pricing) left-aligned, generously vertically spaced, black text on white — then a **black pill "Get Started" button** at the bottom of the card, inset with padding on all sides (not full-bleed).
- Icon morphs from hamburger (☰) to a black rounded-square **X** while open.
- Observed the transition mid-animation: links fade/slide in with what appears to be a stagger (partial-opacity state captured), rather than the whole panel appearing at once.

## 8. Pinned / repeated-panel scroll section

- Confirmed structurally: the DOM contains **two separate copies** of a "FEATURE 1" block (`pw-block-style` wrapper), not one block being restyled. This is the standard pin-and-swap technique — the viewport holds still while stacked panels (feature 1 → 2 → 3) become active in sequence, each rendered as its own DOM node rather than one node with changing content.
- Section is titled "ABOUT OUR PLATFORM / Key Features" with three panels: "Simplify complex workflows," "Unlock actionable business intelligence," "Connect your favourite tools" — each with its own eyebrow label, heading, body copy, and "Get Started" CTA.

## 9. Lazy-loading / media placeholders

- Off-screen media loads behind a **flat mid-grey placeholder block** with a smaller, darker grey skeleton rectangle inside it (roughly centered, rounded corners) — visible mid-fetch when scrolling a section into view for the first time.
- No shimmer/pulse animation was observed on the skeleton itself in the captured frame (may exist but wasn't caught).

## 10. Page loader

- **None.** No preloader/splash element, no loading-percentage counter, no logo animation gate. `document.readyState` was already `complete` and body background was plain white on the first useful paint — content is allowed to paint incrementally as it becomes ready rather than being held behind a loading screen.

## 11. Buttons and links

- Two consistent shapes: solid pill (white-on-dark hero context, or black-on-light later) and translucent/outlined pill (secondary action). Both fully rounded (`border-radius` effectively half the button height — true pill, not just rounded-rect).
- Primary buttons pair label text with a small circular icon-in-circle (▶-style arrow) at the trailing edge, e.g. "Get Started ➜" — the circle is a separate visual chip, not just an inline glyph.
- Direct CSS-rule inspection of hover states wasn't reliable in this pass (no `<button>`/`<a>` elements matched a plain query — the builder renders interactive elements as plain `div`s with pointer handlers attached, consistent with the custom click-overlay system seen in the mobile menu toggle, class `pwb-ignore-click-ui-overlay-interaction-*`).

## 12. Testimonials, pricing, footer

- Testimonials: 3 named quote cards (name, title/company, quoted line) under a "TESTIMONIALS" eyebrow + heading. Desktop capture confirms a static three-column grid. No carousel controls, drag affordance, or active slide state were present.
- Pricing: 3 tiers (Starter $199/mo, Professional $499/mo, Enterprise $899/mo), each with a feature checklist and a CTA ("Sign Up" / "Contact Sales" ×2).
- Footer: the warm fixed visual returns behind a large closing CTA. On mobile the wordmark and email sit above two compact columns for menu and social links.

## 13. Later verification pass

The reference was re-inspected at 1280×720 and 375×812 after the current repository structure had changed:

- The canvas declares `data-engine="three.js r170"`; its fixed `.pwb-scene` ancestor spans the viewport behind the page.
- The mobile menu is an inset white card with a staggered entrance and a black pill CTA, not a full-screen takeover.
- The testimonial section is a static grid.
- The key-feature sequence is made from repeated stacked panels. Mobile linearises the visual cards while keeping the section heading sticky.
- No project or portfolio section exists in the reference, so Sya.R's horizontal work presentation is an adaptation for its own content, not something copied from the reference.
- No distinct crosshair system was found. Sya.R keeps its own technical grid and crosshair vocabulary instead.

The reference still has malformed heading hierarchy and builder-generated click targets. Those implementation details were not adapted.

---

# Principles worth adapting into this repo

Framed as principles, not components to port. The implementation uses only files and dependencies verified in the current repository.

| # | Principle | Where it would land in this repo | Why (not already covered) |
|---|---|---|---|
| 1 | Use a dense sans display scale with strong negative tracking and wide technical eyebrows | `src/app/globals.css` | Inter already exists in the font setup, so no new font or dependency is needed |
| 2 | Make the header transparent over the hero, then switch discretely to a solid light bar | `src/components/Nav.tsx`, `src/app/globals.css` | Clear contrast states without a lingering colour fade |
| 3 | Use an inset mobile card menu with staggered links and a black pill CTA | `src/components/Nav.tsx`, `src/app/globals.css` | Keeps the hero visible and makes the transition feel spatial |
| 4 | Keep one controlled motion signature instead of many unrelated effects | `src/components/HomeHero.tsx` | The verified Figma object travels down a bounded right-side rail and stays out of the copy column |
| 5 | Use dark visual chapters, a decisive light content transition, then a dark pinned sequence | `src/app/page.tsx`, `src/app/globals.css` | Adapts the reference's rhythm to Sya.R's actual work, services, and process content |
| 6 | Present sequential information as stacked sticky panels on desktop and linear cards on touch devices | `src/components/ProcessSequence.tsx`, `src/app/globals.css` | Preserves the pin-and-swap principle without forcing scroll-jacking on mobile |
| 7 | Keep testimonials honest | `src/app/page.tsx` proof section | The reference's card density is adapted to verified project facts; no client quote or result is invented |

Not adapted: a page loader (the reference has none), the builder's non-semantic click targets, and its malformed repeated heading hierarchy.
