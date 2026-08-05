# Build prompt — Sya R / Syazanar

Hand this whole file to an implementation agent. It is written to be executed,
not discussed. Companion docs: [`brand-brief.md`](brand-brief.md),
[`reference-site-audit-peachweb.md`](reference-site-audit-peachweb.md).

§12 carries the decision log. The settled rows are confirmed by the client and are
not open for reinterpretation. The open rows have stated defaults: implement the
default and flag it in your summary rather than inventing a third option.

---

## 1. Role

You are a senior creative developer, digital art director, interaction designer,
and frontend performance engineer. You build award-grade editorial sites in
Next.js with precise responsive typography, scroll-directed choreography, and
restrained WebGL/Canvas atmosphere.

You are an implementation agent, not an advisor. Inspect the repository, write
the code, run the dev server, drive it in a browser at three viewports, read the
console, fix what you find, and repeat until it is polished. Do not report done
until you have seen it working.

---

## 2. Mission

Build the site for **Sya R / Syazanar** — website design, build, and systems for
Malaysian SMEs.

The site has to do two jobs at once, and the tension between them is the whole
design problem:

1. **Prove capability.** The buyer is being asked to spend RM2,250 to RM12,000 on
   a website. The site itself is the only proof that matters. It must look and
   feel like something they could not get from a template, a builder, or the
   cheaper quote they are also holding.
2. **Get out of the way.** The buyer is a busy clinic owner, restaurant owner, or
   professional-services principal. They are not here to admire the craft. Every
   piece of art direction must survive the question: *does this help them decide,
   or does it delay them?*

Resolve it this way: the experience is cinematic, the information is immediate.
A visitor who scrolls once should already know what is sold, roughly what it
costs, and how to ask for a quote. A visitor who scrolls all the way should feel
they have seen a studio operating at a level above the price.

---

## 3. Non-negotiables

These override anything else in this document, including anything that would
look better without them.

1. **No loading gate.** No splash, no preloader, no percentage counter, no logo
   animation before content. First paint is content. Making a busy owner wait is
   the one thing this brand does not do.
2. **Content-first HTML.** Every headline, price, and CTA exists in server-rendered
   markup. Motion is applied on top. With JavaScript disabled the site is a
   complete, readable, navigable document. Nothing is stuck at `opacity: 0`.
3. **`prefers-reduced-motion` is a first-class path, not a stub.** Every scroll
   effect, pin, cursor follower, and canvas has a defined static equivalent that
   is still beautiful. Build the reduced-motion version of each section first,
   then layer motion. Test by emulating it.
4. **Amber is a highlight, never a fill.** `--accent` appears on links, one button
   style, hover/active states, focus rings, and thin rules. It never becomes a
   background panel, a large block, or a gradient wash across a section.
5. **No em dashes in body copy.** No emoji in body copy. No hype adjectives. Short
   sentences. This applies to every string you write.
6. **Invent no facts.** No fake client names, metrics, testimonials, dates, awards,
   or team members. The repo already has the mechanism: `todo()` in
   [`src/lib/content.ts`](../src/lib/content.ts) renders a visible, greppable
   placeholder. Use it. Ship gaps as visible gaps.
7. **Originality.** The peachweb reference is a quality bar, not a source. Do not
   reproduce its layout, wording, section order, project names, imagery,
   iconography, or component shapes. Adapt principles, author your own system.
   If a section of yours could be laid over theirs and match, redesign it.

---

## 4. Stack and repo state

Working repo: `06_Studio/Portfolio/sya.r website`.

**Read [`AGENTS.md`](../AGENTS.md) before writing code.** This is Next.js 16 with
breaking changes from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` for anything you are unsure of. Heed deprecation
notices.

Currently installed:

| Package | Version | Fate |
|---|---|---|
| `next` | 16.2.11 | Keep. App Router |
| `react` / `react-dom` | 19.2.4 | Keep |
| `tailwindcss` | 4 | Keep. `@theme inline` token bridge in `globals.css` |
| `gsap` | 3.15 | **Remove** once no imports remain |
| `three`, `@react-three/fiber`, `@react-three/drei` | | Keep only if the atmosphere layer stays 3D (§6.5) |

### 4.1 Animation stack — decided

**Framer Motion + Lenis.** Add both. Migrate off GSAP entirely; do not run two
animation runtimes side by side. Once nothing imports `gsap`, remove it from
`package.json` and re-lock.

This means you do not have ScrollTrigger, so build the scroll work the idiomatic
Framer Motion way:

- **One Lenis instance**, created in a client provider mounted in the root layout.
  Drive it from `requestAnimationFrame`. Destroy on unmount. Disable it entirely
  when `prefers-reduced-motion: reduce` is set — do not initialise and then damp
  it, do not initialise it at all.
- **Bridge Lenis to Framer Motion once**, not per component: on each Lenis
  `scroll` event, write to a shared `MotionValue`. Every scroll-linked effect
  reads from that one value or from `useScroll({ target, offset })`. Do not attach
  independent scroll listeners in sections.
- **Pinning is `position: sticky`,** not a JS-driven pin. Wrap the sticky child in
  a tall spacer whose height defines the scroll distance, then map
  `useScroll` progress through `useTransform` to whatever moves. This is more
  robust than ScrollTrigger's pin under Lenis, and it degrades to a plain sticky
  element with no JS.
- **Reveals** use `whileInView` with `viewport={{ once: true, margin: "-15% 0px" }}`.
  Preserve the invariant from the code being replaced: **the default rendered
  state is visible.** Set the hidden state only after mount on the client, so
  no-JS and pre-hydration never show blank space. If `useReducedMotion()` returns
  true, skip the variant entirely rather than animating to the same values.
- **`LazyMotion` with the `domAnimation` feature set** and the `m` component, not
  the full `motion` bundle. Do not import `motion` from `framer-motion` in leaf
  components; that is most of the library's weight.
- `MotionConfig` at the root with `reducedMotion="user"` so the whole tree honours
  the OS setting by default.

### 4.2 Repo strategy — decided

**Rebuild the front end. Keep `src/lib/content.ts`.**

Preserve, unchanged in intent:

- `src/lib/content.ts` — the single source of truth for every string, the `todo()`
  placeholder system, and the real client project data (X&Y Clinic, Dream of Red
  Chamber, 6HRS). Rewrite its *values* per §5.1 and §7, keep its *pattern*.
- The palette token **values** in `globals.css` (§6.1). They are contrast-audited;
  re-deriving them would throw away real work. Everything else in that file is
  rewritten.

Rebuild from scratch: all of `src/components/`, all of `src/components/sections/`,
`src/components/hero/`, `src/app/page.tsx`, and the rest of `globals.css`. Read
the existing `hero/` scene for technique before deleting it, then author the
atmosphere layer fresh against §6.5 rather than porting it.

Move the old tree to `src/_legacy/` in your first commit and delete it in your
last, so anything worth salvaging is one `git show` away mid-build.

---

## 5. Brand and content system

### 5.1 Offer

| Tier | Scope | Price |
|---|---|---|
| Starter | 1 to 3 pages | RM2,250 |
| Growth | 5 to 8 pages, WhatsApp enquiry flow | RM6,000 |
| Premium | 10+ pages, multilingual | RM12,000 |
| Custom | System integration, booking, payment, CRM | Quoted |

Prices are shown, not hidden behind a call. That is a positioning decision: it
respects the buyer's time and filters the pipeline. Do not replace any price with
"contact us."

**Reconcile the existing content.** `content.ts` currently carries a `SERVICES`
list and `BUDGET_OPTIONS` bands (`<RM1,500`, `RM1,500–4,000`, …) that predate
these tiers and do not line up with them. Rewrite both to match the table above.
Budget options in the enquiry form should map to tier boundaries, not arbitrary
bands.

### 5.2 Audience

Malaysian SME owners: clinics, F&B, retail, professional services. Either no
website, or a website that produces zero enquiries. Not the LinkedIn
ghostwriting buyer. Write for someone who is skeptical of agencies, short on
time, and can tell when they are being sold to.

### 5.3 CTAs

- **Primary:** request a quote. WhatsApp deep link with a pre-filled message, plus
  an enquiry form. Both land directly with Sya.
- **Secondary:** view portfolio. Live client sites, concept demos, case pages that
  make the tier differences visible.

WhatsApp is primary for a reason: it is how Malaysian SMEs actually transact. Give
it visual weight equal to or above the form.

**[OPEN] Contact details.** `content.ts` has `todo()` for email, phone, and
WhatsApp. If not supplied, leave them as `todo()`. Do not invent a number, and do
not reuse Stellar Rise's details — that decision is already recorded in
`content.ts` and stands.

### 5.4 Voice

Calm, precise, restrained, fast, honest. A website is infrastructure, not
fireworks. Short sentences. Concrete nouns. No "elevate," "unlock," "transform,"
"seamless," "bespoke," "we're passionate about." State what is built and what it
does.

Test for every line: would a busy clinic owner reading this on a phone between
patients find it useful, or find it filler? Cut the filler.

---

## 6. Design system

Author this as tokens in `globals.css` first, then build components against the
tokens. No magic numbers in components.

### 6.1 Palette

Keep the repo's existing tokens. They are correct and contrast-audited.

```
--bg:         #0a0a0a
--text:       #f4f1ea
--text-muted: #9c9689   /* 6.73:1 on bg */
--accent:     #e8a33d
--accent-ink: #0a0a0a   /* text ON accent fills, 9.18:1 */
--metal-1:    #cda54d
--metal-2:    #a9acb1
--glint:      #dcebff
--hairline:   color-mix(in srgb, var(--text) 12%, transparent)
```

Add, do not replace:

```
--surface-1:  color-mix(in srgb, var(--text) 3%, var(--bg));   /* raised panels */
--surface-2:  color-mix(in srgb, var(--text) 6%, var(--bg));   /* hover panels */
--rule:       color-mix(in srgb, var(--text) 7%, transparent); /* grid overlay */
--rule-strong:color-mix(in srgb, var(--text) 18%, transparent);/* crosshairs */
```

Do **not** import the Stellar Rise "Noir & Gold" mapping from the reference audit.
That is a different brand. The audit says so explicitly; honour it.

Black-and-white contrast in the reference becomes **near-black and warm bone**
here. Full-bleed imagery may be desaturated toward monochrome so that amber is
the only saturated thing on screen. That is the contrast mechanism.

### 6.2 Type

Two families exist (Oswald display, Inter body). **Add one monospace** for
technical annotations, via `next/font/google`: IBM Plex Mono or JetBrains Mono,
weights 400/500 only. Bind to `--font-mono`.

The tracking law, applied without exception: **tracking tightens as size grows,
and reverses hard to wide positive only for small uppercase labels.**

| Role | Size | Line-height | Tracking | Family | Case |
|---|---|---|---|---|---|
| Hero display | `clamp(3.25rem, 11vw, 10rem)` | 0.90 | `-0.035em` | display | as authored |
| Section H2 | `clamp(2.25rem, 5.5vw, 4.5rem)` | 1.00 | `-0.028em` | display | as authored |
| H3 / card | `clamp(1.375rem, 2.2vw, 1.875rem)` | 1.15 | `-0.018em` | display | as authored |
| Lead | `clamp(1.0625rem, 1.4vw, 1.25rem)` | 1.55 | `-0.008em` | body | sentence |
| Body | `1rem` | 1.65 | `-0.004em` | body | sentence |
| Label / eyebrow | `0.6875rem` | 1.0 | `+0.3em` | **mono** | UPPERCASE |
| Annotation | `0.625rem` | 1.2 | `+0.18em` | **mono** | UPPERCASE |

Measure caps at 62ch for body, 42ch for lead. Hero and section headings are
hand-broken with explicit line breaks at the design breakpoints — never left to
wrap arbitrarily. A display line that wraps badly at 1024px is a bug.

### 6.3 Grid, space, and technical detailing

- Page margin: `clamp(1.25rem, 4vw, 4.5rem)`. Content max-width `1600px`.
- 12 columns desktop, 6 tablet, 4 mobile. Gutter `clamp(1rem, 1.6vw, 1.75rem)`.
- Vertical rhythm on an 8px base. Section padding block:
  `clamp(6rem, 14vh, 12rem)`. Whitespace is extreme **and intentional** — it is
  the thing that reads as expensive. Do not fill it.
- **Grid overlay:** a `position: fixed`, `pointer-events: none`, `aria-hidden`
  layer of vertical hairlines at `--rule` on column boundaries. Visible at
  `md` and up only. It sits behind content, above background. This is the
  "technical" texture; it must never fight the type.
- **Crosshairs:** 10px plus-marks in `--rule-strong` at the corners of major
  content blocks and at grid intersections beside section labels. Sparse. Six to
  ten on the whole page, not a field of them.
- **Annotations:** small mono labels that behave like drawing callouts —
  `[01 / 04]`, `SECTION — WORK`, `KUALA LUMPUR · 3°08'N`, `RM2,250`. They carry
  real information. Never decorative Lorem.
- **Grain:** a single tiled SVG/canvas noise layer, `mix-blend-mode: overlay`, at
  3 to 5 percent, fixed, `pointer-events: none`. One instance for the page. Not
  animated.

### 6.4 Motion

| Token | Value | Used for |
|---|---|---|
| `--dur-state` | `140ms` | Header solidify, button/link state, menu icon |
| `--dur-enter` | `520ms` | Element reveals |
| `--dur-large` | `820ms` | Hero entrance, pinned panel swap |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Position/pin moves |

Rules:

- Nothing moves without a reason. If you cannot say what an animation
  communicates, delete it.
- State changes are **decisive, not lingering.** The header goes solid at 140ms as
  a discrete change. No 600ms cross-fade.
- Reveals: translate ≤ 24px and opacity. No scale-in on text, no blur-in, no
  rotation, no bounce, no spring overshoot.
- Stagger 40 to 60ms per item, capped at 6 items. Beyond that, reveal as a group.
- Animate `transform` and `opacity` only. If you find yourself animating `top`,
  `width`, `height`, or `filter` in a scroll handler, restructure.
- Framer Motion specifics: prefer `useTransform` over `useEffect` + `set`. Never
  put a scroll-linked value into React state — that is a re-render per frame.
  Reach for `useSpring` only on the cursor follower (§7.1 S4); everywhere else a
  spring reads as the bounce this brand does not do.
- Reduced motion: all of the above collapses to instant final state. Pins release,
  horizontal sections become native scroll or stack, cursor followers do not mount.

### 6.5 Atmosphere layer

Author this fresh; do not port the existing MacBook scene. Its role changes from
a hero object to a **persistent fixed atmospheric layer** whose lighting and
exposure shift with scroll depth, so the page's tonal change is rendered rather
than switched between flat section backgrounds. Sections then choose text
treatment appropriate to the depth they sit at.

Drive it from the shared Lenis `MotionValue` (§4.1) via a `useMotionValueEvent`
subscription that writes into the render loop. Do not give it its own scroll
listener, and do not let it re-render React on scroll.

Start with a 2D canvas field — layered gradient, drifting grain, a slow amber
bloom that tracks scroll depth. Only escalate to R3F if the 2D version is
genuinely not enough atmosphere, and only within the budget below. A restrained
2D layer that hits the budget is worth more to this brand than a 3D one that
does not.

Hard limits on it:

- Mounts **only** when: pointer is fine, `prefers-reduced-motion` is not set,
  viewport ≥ 768px, and `navigator.hardwareConcurrency >= 4` (treat missing as
  passing). Otherwise render the static poster image and skip the runtime.
- Lazy-loaded, never in the critical path, never blocking LCP.
- Capped at 60fps with a frame budget; pauses via `IntersectionObserver` when
  offscreen and on `visibilitychange`.
- Total added JS ≤ 180kb gzipped for a 3D path, ≤ 20kb for the 2D path. If a 3D
  scene cannot hit its number, it does not ship. Atmosphere is not worth a slow
  site for this brand specifically.

---

## 7. Pages and sections

Required routes: `/` (Home), `/work`, `/services`, `/about`, `/contact`.
Plus `/work/[slug]` case pages. Existing `/blog` may stay as-is or be dropped.

### 7.1 Home

**S1 — Hero, kinetic type.**
Full viewport. The name set at display scale, hand-broken across two or three
lines, top-left anchored in the lower two-thirds. Kinetic treatment: per-line
mask reveal on load, with a slow scroll-linked vertical drift and per-line
tracking that tightens fractionally as it settles. Restrained. The type is
already big; it does not need to also spin.

Under it, one positioning line in lead size. Bottom row: mono annotations
(location, discipline, availability) and both CTAs. Scroll cue at the baseline.

No numbers or claims that are not true. If a stat is not sourced, do not invent
a stat to fill the composition — compose without it.

**S2 — Positioning statement.**
Short. Three to four lines at H2 scale on generous whitespace, with a mono
annotation column to the left. States the problem the buyer has (a site that
generates zero enquiries) and the outcome sold. No imagery.

**S3 — Horizontal project gallery.** *(pinned via sticky, §4.1)*
Section sticks; a track of full-bleed project panels translates horizontally as
`useScroll` progress maps through `useTransform` to `x`. Each panel: one
full-bleed device mockup of a real client site (§7.3), desaturated at rest. On
hover, image scales to ~1.04 over 520ms and a **thin serif title** reveals via
mask from the baseline, with a mono index `[01 / 05]` and a one-line descriptor.

- Serif for these titles only. Add one serif display face, or set them in Oswald
  at light weight with wide-open tracking if a third display family bloats the
  font budget past 100kb total. Decide by measuring.
- Keyboard: every panel is a focusable link; focus scrolls its panel into view.
  A pinned section that cannot be tabbed through is broken.
- Touch and reduced motion: unpin, become native `overflow-x` with
  `scroll-snap-type: x mandatory`, or stack vertically. Never a scroll trap.
- Never hijack the page scroll past the section's own length.

**S4 — Selected work index.**
A list, not a grid. Each row: index, client, discipline, year, arrow. Rows are
full-width with hairline rules, generous height. On row hover (fine pointer only)
a project image preview follows the cursor with eased lag, scale-in from 0.94,
and the row's own type shifts to `--accent`.

- Preview position is two `MotionValue`s fed by a single `pointermove` listener on
  the list, smoothed with `useSpring` at low stiffness and high damping so it
  trails without wobbling. Bind them to `x`/`y` on the preview. Never `left`/`top`,
  never React state, one listener for the whole list.
- Touch and reduced motion: preview does not mount; rows show a small static
  thumbnail instead.
- Rows are real links to `/work/[slug]`.

**S5 — Services and tiers.**
The three fixed tiers plus Custom, as a comparison the buyer can scan in ten
seconds. Price at H3 scale, scope as a short list, one CTA per tier. Growth is
the recommended tier and gets a single amber hairline border. That is the entire
emphasis mechanism: no badge, no glow, no colour block.

**S6 — Process.** *(pin-and-swap, exactly one section on the site uses this)*
Viewport holds; stacked panels become active in sequence. Each panel is its own
DOM node, not one node with swapped content. Four to five steps, each with a mono
step index, an H3, two lines of body, and the deliverable named.

Reduced motion and mobile: the panels become a plain vertical numbered list.

**S7 — Proof.**
Client logos or names, and whatever real results exist. Anything unsourced stays
`todo()`. An honest short proof section beats a padded one, and this brand's
entire pitch is honesty.

**S8 — Footer with big email CTA.**
The email address set at display scale, near-hero size, as the dominant element
of the footer. Hover underlines from left in `--accent` over 140ms. Beside it the
WhatsApp CTA at equal weight. Then a mono column of nav, socials, locality,
copyright, and a final crosshair. Grain layer is most visible here.

### 7.2 Other routes

- **`/work`** — the full index. Same row interaction as S4, plus filtering by
  discipline if there are enough projects to justify it (there are not, yet;
  skip until there are).
- **`/work/[slug]`** — case pages. Problem, what was built, what it changed, tier
  it corresponds to. This is where the tier differences become visible, which is
  the stated job of the secondary CTA. Existing project data in `content.ts`
  (X&Y Clinic, Dream of Red Chamber, 6HRS) is real and usable.
- **`/services`** — the full tier comparison, expanded from S5. Add an honest
  "what is not included" per tier. Nothing builds trust with this buyer faster.
- **`/about`** — Sya, the working method, the refusal to use page builders. First
  person if that is accurate to a solo studio; the existing copy says "we," which
  is **[OPEN]** — solo or studio-plural. Do not change it without an answer.
- **`/contact`** — WhatsApp deep link, enquiry form, response time. Form fields:
  name, business, contact, tier interest, one free-text field. Five fields, not
  ten. Every added field costs enquiries.

### 7.3 Project imagery — decided

**Device mockups of real client sites.** Capture the live sites and composite
them into device frames.

Sources, all real and already in `content.ts`:

- X&Y Clinic — `xnyclinic.com`, live since 2023
- Dream of Red Chamber / Jade Atelier — bilingual jadeite e-commerce
- 6HRS (Six HR Solutions)

Capture method: drive each site in a browser at 1440×900 for desktop frames and
375×812 for phone frames, full-page or a deliberately chosen crop. Export at 2x.
Do not screenshot a homepage hero and call it a case study; capture the view that
demonstrates the thing the case page claims (the WhatsApp booking flow, the
bilingual product page, and so on).

The mockup treatment is where this goes wrong by default, so constrain it:

- **One device per panel.** No floating clusters of laptop-plus-tablet-plus-phone.
  That composition is the single clearest agency-template signal there is.
- **No perspective tilt, no drop shadows, no reflective floor, no gradient
  backdrop.** Flat, straight-on, cropped hard by the panel edge so the device
  bleeds off frame rather than floating centred with air around it.
- Device chrome is a **thin outline in `--metal-2` at low opacity**, not a
  photoreal render. The site inside is the subject; the frame is an annotation
  that says "this is a screen."
- Desaturate the screenshot at rest so amber stays the only saturated thing on
  the page (§6.1). Restore saturation on hover, over 520ms, alongside the scale.
- Mono annotation pinned to the panel edge: client, year, tier, live URL.

Right-to-publish: these are Sya's own client sites, which normally makes this
fine. If any client contract restricts showing the work, that project drops to a
`todo()` slot rather than being published. Confirm before shipping to production;
do not block the build on it.

Any project without a usable capture gets a typographic panel and a `todo()`
image slot. An honest gap beats a stock mockup.

### 7.4 Header and mobile menu

- Fixed, transparent over hero, flips to solid at 140ms as a **discrete state**
  once scrolled past the hero. Not a constant blur, not a gradual fade.
- Mobile: a shaped inset card dropping below the header, not a full-bleed
  takeover. Links stagger in at 40ms. Icon morphs hamburger to X.
- Focus trap while open, `Esc` closes, focus returns to the toggle, body scroll
  locks (stop Lenis while open, restart on close). `aria-expanded` and
  `aria-controls` on the toggle, both correct.

---

## 8. Accessibility and performance

Non-optional, verified before you report done.

- All interactive elements reachable and operable by keyboard, in visible DOM
  order. Visible focus ring using `--glint`, offset 4px, never `outline: none`.
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1. Text over imagery gets a scrim
  or gradient, never hope.
- Semantic landmarks, one `h1` per page, no heading level skips.
- Decorative layers (grid, grain, canvas, crosshairs) are `aria-hidden` and
  `pointer-events: none`.
- Images: explicit `width`/`height` or aspect-ratio box, `next/image`, AVIF/WebP,
  `sizes` set. Grey skeleton placeholder blocks for lazy media, matching the
  final aspect ratio so nothing shifts.
- Budgets: LCP < 2.0s and CLS < 0.02 on a throttled mid-tier mobile profile. Total
  font payload ≤ 100kb. No layout shift from font swap — use `next/font` with
  `display: swap` and matched fallback metrics.
- Zero console errors and zero React hydration warnings. A hydration warning is a
  bug, not noise.

---

## 9. Build order

Work in this order. Do not jump ahead; each step de-risks the next.

1. Read `AGENTS.md` and the relevant `node_modules/next/dist/docs/` guides.
2. Move the old front end to `src/_legacy/`. Install `framer-motion` and `lenis`.
   Do not remove `gsap` yet; remove it at step 7 when nothing imports it.
3. Tokens: palette additions, type scale, motion tokens, mono font, grid overlay
   and grain primitives. Prove them on a scratch route.
4. Content: rewrite `content.ts` to the tier table, new section copy, `todo()` for
   everything unsourced.
5. Capture and composite the project imagery per §7.3, into `public/work/`. Do
   this before layout so panels are built against real aspect ratios.
6. Static pass: all five routes and the case template, fully laid out, correct
   type and grid, **zero motion, no Lenis**. This is the reduced-motion build. It
   must already look good. If it does not, the motion is compensating for weak
   layout and the layout is what needs fixing.
7. Header state, mobile menu, focus management. Delete `src/_legacy/`, drop
   `gsap`, re-lock.
8. Motion layer: Lenis provider and the shared `MotionValue` bridge first, then
   `LazyMotion`/`MotionConfig` at the root, then reveals, hero kinetic type, S3
   sticky track, S4 cursor preview, S6 pin-and-swap. Each behind a reduced-motion
   guard.
9. Atmosphere layer with its capability gates and budget check.
10. Verification (§10).

Commit at each numbered step so any layer can be reverted independently.

---

## 10. Verification loop

Run it. Do not skip it. Do not ask the user to check for you.

```bash
npm run dev
```

Then, in the browser, for each of `/`, `/work`, `/services`, `/about`, `/contact`,
and one case page:

1. Screenshot at 1440×900, 768×1024, and 375×812.
2. Scroll the full page at each width. Look for: pinned sections releasing
   correctly, horizontal track not trapping scroll, no horizontal overflow on the
   body, no jank at section boundaries.
3. Read the console. Zero errors, zero hydration warnings.
4. Emulate `prefers-reduced-motion: reduce`, reload, repeat 1 and 2. Confirm
   nothing is invisible, nothing is stuck mid-animation, no pins hold.
5. Tab through the entire page. Confirm order, visible focus, no traps, and that
   the horizontal gallery and mobile menu are operable.
6. Disable JavaScript. Confirm the page is complete and readable.
7. `npm run build` and `npm run lint`. Both clean.

Fix and repeat until all seven pass. Report what you actually observed, including
anything still failing.

---

## 11. Definition of done

- Five routes plus case template, all responsive at the three widths.
- The four required experiences built and working: kinetic hero, horizontal
  gallery with hover scale and serif title reveal, selected-work list with
  cursor-following preview, footer with display-scale email CTA and grain.
- Reduced-motion path complete and independently good-looking.
- No-JS path complete.
- Budgets met, console clean, build and lint clean.
- Every unsourced fact visible as a `todo()`, listed in your summary via
  `grep -rn "isTodo: true" src/lib/content.ts`.
- Nothing in the output could be mistaken for the reference site.

---

## 12. Decisions

### Settled — build to these, do not relitigate

| # | Decision | Ruling |
|---|---|---|
| 1 | Site scope | **One site.** Syazanar studio site, built with portfolio-grade art direction. Tiers and quote CTA stay. |
| 2 | Animation stack | **Framer Motion + Lenis.** Migrate off GSAP entirely, then remove it (§4.1). |
| 3 | Repo strategy | **Rebuild the front end, keep `content.ts`** and the audited palette values (§4.2). |
| 4 | Project imagery | **Device mockups of real client sites**, under the anti-template constraints in §7.3. |

### Still open — implement the default and flag it

| # | Decision | Default if unanswered |
|---|---|---|
| 5 | Voice: solo "I" or studio "we" | Keep the existing "we" |
| 6 | Contact details: WhatsApp number, email, domain | `todo()` placeholders, no invented values |
| 7 | Keep or drop `/blog` | Keep, unstyled, out of nav |
| 8 | Serif face for gallery titles, or Oswald light with open tracking | Decide by measuring against the 100kb font budget (§6.2) |
| 9 | Client permission to publish each captured site | Ship all three, confirm before production (§7.3) |
