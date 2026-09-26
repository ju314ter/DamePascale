import Link from "next/link";
import type { Bijou } from "@/sanity/lib/types";
import CardBijou from "@/components/product-cards/card-bijou";
import { btnSecondary } from "@/components/ui/cta";
import { WildRose } from "@/components/botanical/decorations";

/**
 * « Trop tard ! » : les pièces épuisées, sorties de la boutique principale.
 * Dès qu'une pièce est réapprovisionnée (stock > 0), elle y retourne d'elle-même.
 */
export function SoldOutSection({ bijoux }: { bijoux: Bijou[] }) {
  if (bijoux.length === 0) return null;
  return (
    <section
      id="trop-tard"
      aria-labelledby="trop-tard-title"
      className="relative scroll-mt-20 border-t border-olive-100/80 pt-14 md:pt-20"
    >
      <WildRose className="pointer-events-none absolute top-8 right-[4%] w-14 text-[#c4897a]/25 rotate-12" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div className="max-w-xl">
            <span className="font-hand text-xl text-[#c4897a]">
              Elles ont déjà trouvé preneur
            </span>
            <h2
              id="trop-tard-title"
              className="font-serif-display text-3xl md:text-4xl text-olive-800"
            >
              Trop tard !
            </h2>
            <p className="font-editorial text-[0.9rem] text-olive-700 mt-2 leading-relaxed">
              Ces pièces uniques sont parties. Un coup de cœur quand même ? Je
              peux imaginer une création dans le même esprit, rien que pour
              vous.
            </p>
          </div>
          <Link
            href="/sur-mesure"
            className={`${btnSecondary} self-start md:self-auto`}
          >
            Demander une création similaire
          </Link>
        </div>
      </div>
      <ul
        className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] scroll-px-4 sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4"
        aria-label="Pièces épuisées"
      >
        {bijoux.map((b) => (
          <li
            key={b._id}
            className="snap-start flex-shrink-0 w-[44%] sm:w-[30%] lg:w-[22%] xl:w-[18%]"
          >
            <CardBijou item={b} sizes="(max-width: 640px) 44vw, 22vw" />
          </li>
        ))}
      </ul>
      {bijoux.length > 2 && (
        <p className="md:hidden text-center font-editorial text-[0.72rem] text-olive-500 mt-1">
          Faites glisser pour voir les {bijoux.length} pièces →
        </p>
      )}
    </section>
  );
}
