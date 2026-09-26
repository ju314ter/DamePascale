import { Leaf, Truck, ShieldCheck, RotateCcw, Hand } from "lucide-react";
import { SHIPPING } from "@/lib/site";
import { formatPrice } from "@/lib/pricing";

export const TRUST_ITEMS = [
  { icon: Hand, title: "Fait main", text: "Façonné à la main près du Mans" },
  {
    icon: Leaf,
    title: "Fleurs naturelles",
    text: "Cueillies, séchées et figées dans la résine",
  },
  {
    icon: Truck,
    title: `Livraison offerte dès ${SHIPPING.freeThreshold} €`,
    text: `${formatPrice(SHIPPING.cost)} en dessous · suivie`,
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    text: "Carte bancaire, PayPal, Link",
  },
  {
    icon: RotateCcw,
    title: "14 jours pour changer d'avis",
    text: "Sur les pièces de la boutique",
  },
];

/** Liste de réassurance (fiche produit, panier). */
export function TrustList({ compact = false }: { compact?: boolean }) {
  const items = compact ? TRUST_ITEMS.slice(2) : TRUST_ITEMS;
  return (
    <ul className="grid gap-3">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <Icon
            className="w-[18px] h-[18px] text-sage-500 flex-shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <p className="font-editorial text-[0.8rem] text-olive-700 leading-snug">
            <span className="text-olive-900">{title}</span>
            <span className="text-olive-600"> — {text}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Bandeau horizontal de réassurance (accueil, boutique). */
export function TrustStrip() {
  const items = [
    TRUST_ITEMS[0],
    TRUST_ITEMS[1],
    TRUST_ITEMS[2],
    TRUST_ITEMS[3],
  ];
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
      {items.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className="flex flex-col items-center text-center gap-1.5 px-1"
        >
          <Icon className="w-6 h-6 text-sage-500" strokeWidth={1.4} />
          <span className="font-editorial text-[0.78rem] md:text-sm text-olive-900 leading-tight">
            {title}
          </span>
          <span className="font-editorial text-[0.7rem] md:text-xs text-olive-600 leading-snug">
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}
