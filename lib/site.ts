/**
 * Informations de la marque, centralisées pour éviter les incohérences
 * entre les pages (adresse, e-mail, livraison…).
 */
export const SITE = {
  name: "Dame Pascale",
  tagline: "Bijoux en fleurs naturelles, faits main près du Mans",
  description:
    "Bijoux artisanaux en fleurs naturelles séchées et résine, façonnés à la main à Yvré-l'Évêque, près du Mans. Boutique en ligne, ateliers DIY, créations sur mesure et marchés artisanaux.",
  owner: "Pascale Féger",
  email: "damepascale72@gmail.com",
  location: "Yvré-l'Évêque, près du Mans (Sarthe)",
  locationShort: "Près du Mans",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Yvr%C3%A9-l%27%C3%89v%C3%AAque%2C%2072530",
  instagram: {
    handle: "@dame_pascale",
    url: "https://www.instagram.com/dame_pascale",
  },
  facebook: {
    name: "Mes petites créa chéries",
    url: "https://www.facebook.com/p/Mes-petites-cr%C3%A9a-ch%C3%A9ries-100057342554163/",
  },
} as const;

export const SHIPPING = {
  /** Livraison offerte à partir de ce montant (produits, après promotions). */
  freeThreshold: 50,
  cost: 4.99,
  /** Délai affiché sur les fiches produit et au panier (cf. CGV). */
  delay: "Expédition sous 15 jours maximum",
  /** Pays livrés (France et zone euro, cf. CGV). */
  countries: [
    "FR",
    "BE",
    "LU",
    "MC",
    "DE",
    "AT",
    "NL",
    "ES",
    "PT",
    "IT",
    "IE",
    "FI",
    "EE",
    "LV",
    "LT",
    "SK",
    "SI",
    "GR",
    "CY",
    "MT",
    "HR",
  ],
} as const;

export const REPLY_DELAY = "48 h";

/** URL publique absolue du site, avec protocole. */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "localhost:3000";
  const withProtocol = /^https?:\/\//.test(raw)
    ? raw
    : `${raw.startsWith("localhost") ? "http" : "https"}://${raw}`;
  return withProtocol.replace(/\/$/, "");
}
