import type { Metadata, Viewport } from "next";
import "../globals.css";
import "@fontsource-variable/caveat";
import "@fontsource-variable/playfair-display";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/libre-baskerville/400-italic.css";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import Footer from "@/components/footer/footer";
import CartDrawer from "@/components/panier/panier";
import { Toaster } from "@/components/ui/toaster";
import { getBijouNavlinks } from "@/sanity/lib/bijoux/calls";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default:
      "Dame Pascale — Bijoux en fleurs naturelles faits main près du Mans",
    template: "%s · Dame Pascale",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "bijoux fleurs séchées",
    "bijou résine fleur naturelle",
    "bijoux artisanaux Le Mans",
    "atelier bijoux fleurs séchées",
    "bijou sur mesure fleurs de mariage",
    "créatrice Sarthe",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: "Dame Pascale — Un herbier devenu bijou",
    description: SITE.description,
    images: [
      {
        url: "/marches/polaroids/bijou.jpg",
        width: 400,
        height: 400,
        alt: "Bijou Dame Pascale",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fefefe",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.name,
  description: SITE.description,
  url: siteUrl(),
  email: SITE.email,
  image: `${siteUrl()}/marches/stand_4.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yvré-l'Évêque",
    postalCode: "72530",
    addressRegion: "Sarthe",
    addressCountry: "FR",
  },
  sameAs: [SITE.instagram.url, SITE.facebook.url],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getBijouNavlinks();

  return (
    <html lang="fr">
      <body className="bg-cream-50 font-sans text-olive-900 antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:rounded"
        >
          Aller au contenu
        </a>
        <AnnouncementBar />
        <Header categories={categories} />
        <main id="contenu">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
