import type { Metadata } from "next";
import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import { SmallBlossom } from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Paiement interrompu",
  robots: { index: false },
};

export default function CancelPage() {
  return (
    <div style={warmVintage} className="min-h-[70vh]">
      <div className="max-w-xl mx-auto px-4 py-16 md:py-24 text-center">
        <SmallBlossom className="w-12 h-12 text-olive-300 mx-auto mb-4" />
        <h1 className="font-serif-display text-4xl text-olive-800">
          Paiement interrompu
        </h1>
        <p className="font-editorial text-olive-700 mt-4 leading-relaxed">
          Aucun montant n&apos;a été débité et votre panier vous attend. Un
          souci avec le paiement ? Écrivez-moi à{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
          , nous trouverons une solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/commande" className={btnPrimary}>
            Retour au panier
          </Link>
          <Link href="/boutique-bijou" className={btnSecondary}>
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
