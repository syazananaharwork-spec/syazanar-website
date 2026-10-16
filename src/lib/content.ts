/** Public site copy and structured content. Keep all marketing claims here. */
export type Todo = { text: string; isTodo: true };
export function todo(text: string): Todo {
  return { text, isTodo: true };
}

export const SITE = {
  name: "Sya.R",
  locality: "Kuala Lumpur, Malaysia",
  domain: "syazanar.vercel.app",
  url: "https://syazanar.vercel.app",
  description:
    "Custom websites and digital systems for Malaysian SMEs. Clear scope, clear pricing, and a direct enquiry path.",
} as const;

export const WHATSAPP = {
  display: "012 649 2560",
  international: "+60126492560",
  url: "https://wa.me/60126492560",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const HERO = {
  name: "Independent designer + developer",
  lines: ["Sya.R", "Creative", "Portfolio"],
  support:
    "Distinctive websites and digital systems for Malaysian SMEs—designed with clarity, built for enquiry, and made to last.",
  labels: ["Kuala Lumpur", "Design + development", "Selected work 2026"],
} as const;

export type ProjectKind = "Live client work" | "Prototype" | "Concept demonstration";

export type Project = {
  slug: string;
  client: string;
  shortClient: string;
  kind: ProjectKind;
  category: string;
  status: string;
  liveUrl: string;
  image: string;
  mobileImage: string;
  imageAlt: string;
  summary: string;
  problem: string;
  built: string;
  decisions: readonly string[];
  enquiryPath: string;
  responsive: string;
  outcome: string | Todo;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "6hrs",
    client: "6HRS · Six HR Solutions",
    shortClient: "6HRS",
    kind: "Live client work",
    category: "Website design + build",
    status: "Live site",
    liveUrl: "https://6hrs.com.my/",
    image: "/work/6hrs-desktop.webp",
    mobileImage: "/work/6hrs-mobile.webp",
    imageAlt: "6HRS website homepage for Malaysian HR outsourcing services",
    summary:
      "A complete marketing website that makes eight HR services easier to compare and routes owners to a consultation.",
    problem:
      "6HRS offers several related HR services. The site needed to explain the difference between them without making a busy owner decode industry language.",
    built:
      "A 14-page static website covering services, service detail pages, company information, contact, privacy, and terms.",
    decisions: [
      "A service architecture organised around business needs.",
      "Repeated consultation paths across high-intent pages.",
      "Desktop and mobile layouts prepared for every public route.",
    ],
    enquiryPath:
      "Owners can compare services, read the relevant detail page, then book a consultation from the same decision context.",
    responsive:
      "The complete public sitemap was captured and verified across desktop and mobile layouts.",
    outcome: "The verified site is live with 14 public pages.",
  },
  {
    slug: "early-winter",
    client: "Early Winter",
    shortClient: "Early Winter",
    kind: "Concept demonstration",
    category: "Bilingual café concept",
    status: "Prospect build",
    liveUrl: "https://early-winter-cafe.vercel.app/",
    image: "/work/early-winter-desktop.webp",
    mobileImage: "/work/early-winter-mobile.webp",
    imageAlt: "Early Winter café website with a full-bleed coffee-pour hero film",
    summary:
      "A café concept that gives a Taichung coffee and dessert house a site of its own, then hands ordering back to the shop the café already runs.",
    problem:
      "The café's public face was a store page. The room, the food menu, and the way the place feels had no site of their own, in either of the two languages its customers read.",
    built:
      "A hand-built static site in English and Traditional Chinese: a hero film with a working pause control, a featured-dish carousel, a nine-dish menu filtered by course, and directions, phone, and email that act on tap.",
    decisions: [
      "English leads with Traditional Chinese running alongside, because the café's audience reads both.",
      "The menu funnels into the café's existing Shopify menu and bean shop rather than replacing the store.",
      "Dishes are filtered by course—brunch, coffee, dessert—instead of listed in one long column.",
      "No framework and no build step, so the page stays light on a phone in the room.",
    ],
    enquiryPath:
      "Visitors move from the hero film into the dish carousel, then out to the café's Shopify menu, its bean shop, or a direct call.",
    responsive:
      "The live preview was reviewed at 1440×900 and 390×844, with every homepage section captured at both sizes.",
    outcome: todo("Prospect build; not yet the café's live production site"),
  },
  {
    slug: "sokach-diary",
    client: "Sokach Diary",
    shortClient: "Sokach Diary",
    kind: "Concept demonstration",
    category: "Bilingual bakery concept",
    status: "Live concept",
    liveUrl: "https://sokach-diary.vercel.app/",
    image: "/work/sokach-diary-desktop.webp",
    mobileImage: "/work/sokach-diary-mobile.webp",
    imageAlt: "Sokach Diary bakery concept featuring an original Basque cheesecake",
    summary:
      "A bilingual bakery diary concept that presents small-batch bakes as an evolving editorial collection and routes orders to Instagram.",
    problem:
      "A small-batch bakery needs more character than a fixed product catalogue. The experience had to make each bake memorable while keeping current availability and ordering flexible.",
    built:
      "A responsive one-page concept with an interactive flavour hero, brand story, bake collection, working approach, Traditional Chinese content, and an Instagram ordering path.",
    decisions: [
      "The collection is framed as diary pages rather than permanent stock.",
      "English and Traditional Chinese share one visual system.",
      "Editorial food photography carries each flavour's point of view.",
      "Instagram remains the source for current bakes, availability, and orders.",
    ],
    enquiryPath:
      "Visitors move from the flavour-led hero and bake collection into a direct Instagram message for the current selection and order details.",
    responsive: "The live deployment was verified at desktop and mobile portfolio sizes.",
    outcome: todo("Concept only; no commercial outcome documented"),
  },
  {
    slug: "dream-of-red-chamber-jade",
    client: "Dream of Red Chamber Jade",
    shortClient: "Dream of Red Chamber",
    kind: "Concept demonstration",
    category: "Bilingual commerce concept",
    status: "Live concept",
    liveUrl: "https://jade-shop-phi.vercel.app/",
    image: "/work/jade-atelier-desktop.webp",
    mobileImage: "/work/jade-atelier-mobile.webp",
    imageAlt: "Dream of Red Chamber Jade bilingual ecommerce homepage",
    summary:
      "A bilingual jade atelier concept where collection, provenance, poetry, and product detail share one editorial system.",
    problem:
      "Jade needs context. A simple product grid would not explain origin, material detail, or the cultural language around each piece.",
    built:
      "Seven routes covering the home page, collection, house story, custom work, sold archive, contact, and a product detail example.",
    decisions: [
      "English and Chinese content designed into the layout.",
      "Product stories supported by provenance and dimensions.",
      "Collection and archive routes separated for clearer browsing.",
    ],
    enquiryPath:
      "Collection browsing leads into product detail, while custom requests and direct enquiries remain visible across the experience.",
    responsive:
      "All seven routes have verified desktop and mobile captures from the live deployment.",
    outcome: todo("Commercial outcome not documented"),
  },
  {
    slug: "xny-clinic",
    client: "X&Y Clinic",
    shortClient: "X&Y Clinic",
    kind: "Live client work",
    category: "Clinic website + enquiry flow",
    status: "Live site",
    liveUrl: "https://xnyclinic.com/",
    image: "/work/xny-clinic-desktop.webp",
    mobileImage: "/work/xny-clinic-mobile.webp",
    imageAlt: "X&Y Clinic website with private consultation call to action",
    summary:
      "A custom clinic website that organises medical, wellness, and aesthetic services around a private WhatsApp booking path.",
    problem:
      "The clinic serves different health needs for men and women. The website needed to feel discreet while keeping treatments and booking easy to find.",
    built:
      "A custom WordPress theme with service architecture, treatment routes, clinic information, and WhatsApp-first booking calls to action.",
    decisions: [
      "For Her and For Him pathways clarify sensitive services.",
      "Critical CSS supports a fast first view.",
      "WhatsApp deep links remove the need for a separate form.",
    ],
    enquiryPath:
      "Each treatment path can move directly into a private WhatsApp conversation with the clinic.",
    responsive:
      "Ten homepage sections were captured and reviewed in matching desktop and mobile layouts.",
    outcome: "The verified website is live at xnyclinic.com.",
  },
  {
    slug: "sentral-dental-clinic",
    client: "Sentral Dental Clinic",
    shortClient: "Sentral Dental",
    kind: "Concept demonstration",
    category: "Clinic lead-generation prototype",
    status: "Live concept",
    liveUrl: "https://sentral-dental-clinic-nu.vercel.app/",
    image: "/work/sentral-dental-desktop.webp",
    mobileImage: "/work/sentral-dental-mobile.webp",
    imageAlt: "Sentral Dental Clinic prototype homepage",
    summary:
      "A direct clinic prototype that separates four treatment pathways and keeps appointment access close to each service.",
    problem:
      "Dental visitors often arrive with one urgent question. The structure needed to move from treatment need to appointment without a long search.",
    built:
      "A responsive prototype for braces, implants, wisdom tooth treatment, and general dental care near KL Sentral.",
    decisions: [
      "Treatment-first navigation.",
      "Location context in the opening view.",
      "Clear appointment pathways alongside service information.",
    ],
    enquiryPath:
      "Service sections keep booking actions within reach instead of sending visitors through a generic contact maze.",
    responsive: "The supplied deployment was verified at 1440×900 and 375×812.",
    outcome: todo("Prototype only; no client outcome documented"),
  },
  {
    slug: "senada-consulting",
    client: "SENADA Consulting",
    shortClient: "SENADA",
    kind: "Prototype",
    category: "B2B service prototype",
    status: "Live prototype",
    liveUrl: "https://senada-consulting-prototype.vercel.app/",
    image: "/work/senada-desktop.webp",
    mobileImage: "/work/senada-mobile.webp",
    imageAlt: "SENADA Consulting background screening website prototype",
    summary:
      "A B2B prototype that turns a complex background-screening offer into a structured set of checks, markets, and enquiry routes.",
    problem:
      "Screening services span many check types and countries. The site needed to explain scope without making compliance language feel opaque.",
    built:
      "A responsive prototype covering pre-employment, corporate, and international screening across Southeast Asia.",
    decisions: [
      "Service scope grouped by decision type.",
      "Regional coverage made visible early.",
      "Direct discussion CTA for candidate, supplier, and international requirements.",
    ],
    enquiryPath:
      "Visitors can identify the relevant screening category before starting a scoped discussion.",
    responsive: "The supplied deployment was verified at 1440×900 and 375×812.",
    outcome: todo("Prototype only; no client outcome documented"),
  },
  {
    slug: "elaine-leong-associates",
    client: "Messrs Elaine, Leong & Associates",
    shortClient: "Elaine, Leong & Associates",
    kind: "Concept demonstration",
    category: "Professional services concept",
    status: "Live concept",
    liveUrl: "https://web-mocha-five-21.vercel.app/",
    image: "/work/elaine-leong-desktop.webp",
    mobileImage: "/work/elaine-leong-mobile.webp",
    imageAlt: "Property law website concept for Messrs Elaine, Leong and Associates",
    summary:
      "A plain-language legal website concept for property buyers who need the process explained before they enquire.",
    problem:
      "Property transactions involve unfamiliar documents, deadlines, and legal terms. The website needed to reduce uncertainty without oversimplifying the work.",
    built:
      "A responsive concept focused on conveyancing, subsale purchases, auction-property purchases, and sale and purchase agreements.",
    decisions: [
      "Plain-language explanations lead the hierarchy.",
      "Practice areas connect to real buyer questions.",
      "The contact path follows the information a prospective client needs first.",
    ],
    enquiryPath:
      "Visitors learn what the legal process covers, then move into a focused discussion about their property matter.",
    responsive: "The supplied deployment was verified at 1440×900 and 375×812.",
    outcome: todo("Concept only; no client outcome documented"),
  },
] as const;

export type ServiceTier = {
  name: string;
  price: string;
  pageRange: string;
  capability: string;
  idealFor: string;
  included: readonly string[];
  excluded: readonly string[];
  upgrade: string;
  featured?: boolean;
};

export const SERVICES: readonly ServiceTier[] = [
  {
    name: "Starter",
    price: "RM2,250",
    pageRange: "1 to 3 pages",
    capability: "A focused website with one clear enquiry path.",
    idealFor: "New businesses, focused offers, and simple service businesses.",
    included: ["Custom visual direction", "Responsive build", "Core enquiry CTA", "Launch setup"],
    excluded: ["Large content libraries", "Multilingual system", "Custom integrations"],
    upgrade: "Move to Growth when more services or customer pathways need their own pages.",
  },
  {
    name: "Growth",
    price: "RM6,000",
    pageRange: "5 to 8 pages",
    capability: "A full marketing site with a WhatsApp enquiry flow.",
    idealFor: "Clinics, professional services, F&B, retail, and established SMEs.",
    included: ["Information architecture", "Custom page designs", "WhatsApp enquiry flow", "Responsive build", "Launch setup"],
    excluded: ["10+ page content systems", "Multilingual capability", "Complex business integrations"],
    upgrade: "Move to Premium when the site needs depth, languages, or larger content structures.",
    featured: true,
  },
  {
    name: "Premium",
    price: "RM12,000",
    pageRange: "10 or more pages",
    capability: "A larger website with multilingual capability.",
    idealFor: "Businesses with multiple services, locations, audiences, or languages.",
    included: ["Extended content architecture", "Multilingual capability", "Custom page system", "Advanced responsive QA", "Launch setup"],
    excluded: ["Booking engines", "Payment processing", "CRM integration"],
    upgrade: "Add a Custom scope when the website must connect to business software.",
  },
  {
    name: "Custom",
    price: "Quoted individually",
    pageRange: "Scope based",
    capability: "A website connected to the systems that run the business.",
    idealFor: "Businesses that need booking, payment, CRM, or operational integrations.",
    included: ["Technical discovery", "System architecture", "Integration planning", "Custom implementation", "Launch support"],
    excluded: ["Undefined third-party fees", "Software subscriptions", "Unapproved scope changes"],
    upgrade: "The scope is built around the systems, risk, and support the project actually needs.",
  },
] as const;

export const PROCESS = [
  { name: "Discovery", deliverable: "A concise brief covering the offer, audience, pages, and enquiry goal." },
  { name: "Structure", deliverable: "A page map and content hierarchy before visual work begins." },
  { name: "Design", deliverable: "A responsive visual system applied to the key page types." },
  { name: "Build", deliverable: "A production-ready website with the enquiry path connected." },
  { name: "Launch", deliverable: "Final QA, deployment, and a clear handover." },
] as const;

export const ABOUT = {
  title: "We treat the website as one working system.",
  paragraphs: [
    "Strategy, structure, design, development, and the enquiry path are handled together. That keeps the site coherent and keeps decisions close to the people building it.",
    "We avoid generic page-builder output because a template cannot decide what your customer needs to understand first. The structure should follow the business, not the theme marketplace.",
    "Clear pricing matters. It gives both sides a useful starting point before a call. If the project needs something outside a tier, we scope it openly.",
  ],
} as const;

export const CONTACT_TIERS = [
  "Starter, RM2,250",
  "Growth, RM6,000",
  "Premium, RM12,000",
  "Custom, quoted",
  "Not sure",
] as const;

export const FOOTER = {
  prompt: "Tell us what you need.",
  copyright: `© ${new Date().getFullYear()} Sya.R. All rights reserved.`,
} as const;

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function whatsappQuoteUrl(tier?: string) {
  const message = tier
    ? `Hello Sya.R, I would like to request a website quote.\n\nTier: ${tier}`
    : "Hello Sya.R, I would like to request a website quote.";
  return `${WHATSAPP.url}?text=${encodeURIComponent(message)}`;
}
