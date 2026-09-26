import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getBijoux, getTaxonomies } from "@/sanity/lib/bijoux/calls";
import ShopBrowser from "@/components/shop/shop-browser";
import { TrustStrip } from "@/components/shop/trust-list";
import { SoldOutSection } from "@/components/shop/sold-out-section";
import { BranchSprig, PressedLeaf } from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";
import { btnPrimary } from "@/components/ui/cta";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique — bijoux en fleurs naturelles",
  description:
    "Colliers, boucles d'oreilles, bagues et bracelets en fleurs naturelles séchées et résine. Pièces uniques faites main près du Mans. Livraison offerte dès 50 €.",
  alternates: { canonical: "/boutique-bijou" },
};

export default async function BoutiquePage() {
  const [bijoux, taxonomies] = await Promise.all([
    getBijoux(),
    getTaxonomies(),
  ]);
  // Seules les pièces en stock sont en boutique ; les autres passent dans « Trop tard ! ».
  // Une pièce réapprovisionnée y retourne automatiquement.
  const available = bijoux.filter((b) => b.stock > 0);
  const soldOut = bijoux.filter((b) => b.stock <= 0);

  return (
    <div style={warmVintage} className="relative overflow-x-clip">
      <PressedLeaf className="pointer-events-none absolute top-6 right-[4%] w-16 md:w-24 text-olive-300/30 rotate-12" />
      <BranchSprig className="pointer-events-none absolute top-24 left-[2%] w-24 md:w-36 text-sage-400/20 -rotate-6 hidden sm:block" />

      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-5 md:pb-8">
        <nav
          aria-label="Fil d'Ariane"
          className="font-editorial text-[0.72rem] text-olive-500 mb-3"
        >
          <Link href="/" className="hover:text-olive-800">
            Accueil
          </Link>{" "}
          <span aria-hidden>/</span>{" "}
          <span className="text-olive-700">Boutique</span>
        </nav>
        <span className="font-hand text-xl text-bronze-500">
          Pièces uniques, faites main
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-olive-800 leading-[1.05] mt-1">
          La boutique
        </h1>
        <p className="font-editorial text-[0.92rem] md:text-base text-olive-700 mt-3 max-w-xl leading-relaxed">
          Des fleurs cueillies, séchées puis figées dans la résine. Chaque bijou
          est unique : quand il est parti, il ne revient pas.
        </p>
      </header>

      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <ShopBrowser
          bijoux={available}
          taxonomies={taxonomies}
          soldOutCount={soldOut.length}
        />
      </Suspense>

      <div className="mt-16 md:mt-24">
        <SoldOutSection bijoux={soldOut} />
      </div>

      {/* Réassurance + sur mesure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="rounded-3xl bg-white/80 border border-olive-100 px-5 py-10 md:px-12">
          <TrustStrip />
        </div>
        <div className="mt-10 grid md:grid-cols-[1fr_1.2fr] gap-8 items-center rounded-3xl overflow-hidden bg-sage-50 border border-sage-100">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-56 bg-cream-100">
            <Image
              src="/fleur-nobg.png"
              alt="Broche en fleur d'orchidée naturelle"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-contain p-6"
            />
          </div>
          <div className="px-6 pb-10 md:py-12 md:pr-12">
            <span className="font-hand text-xl text-sage-600">
              Vous ne trouvez pas votre bonheur ?
            </span>
            <h2 className="font-serif-display text-3xl md:text-4xl text-olive-800 mt-1">
              Une pièce rien que pour vous
            </h2>
            <p className="font-editorial text-[0.92rem] text-olive-700 mt-3 leading-relaxed">
              Les fleurs de votre mariage, d&apos;une naissance, de votre
              jardin… Je les transforme en un bijou à garder toute la vie.
            </p>
            <Link href="/sur-mesure" className={`${btnPrimary} mt-6`}>
              Imaginer ma création
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
