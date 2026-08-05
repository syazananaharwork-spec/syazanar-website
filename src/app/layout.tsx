import type { Metadata } from "next";
import { Gilda_Display, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { SkipLink } from "@/components/SkipLink";
import { SITE } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const gilda = Gilda_Display({ variable: "--font-gilda", subsets: ["latin"], weight: "400", display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Sya.R | Websites for Malaysian SMEs", template: "%s | Sya.R" },
  description: SITE.description,
  applicationName: "Sya.R",
  openGraph: { title: "Sya.R | Websites built to earn enquiries", description: SITE.description, url: SITE.url, siteName: "Sya.R", type: "website" },
  twitter: { card: "summary", title: "Sya.R | Websites built to earn enquiries", description: SITE.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${gilda.variable} ${plexMono.variable}`}>
      <body>
        <Providers>
          <SkipLink />
          <div className="site-grid" aria-hidden="true" />
          <div className="site-grain" aria-hidden="true" />
          <Atmosphere />
          <Nav />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
