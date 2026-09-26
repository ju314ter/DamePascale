"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Check, ChevronDown, ShoppingBag, Sparkles } from "lucide-react";
import type { Bijou } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";
import { hasPromo } from "@/lib/pricing";
import { SHIPPING } from "@/lib/site";
import { CarouselProduct } from "@/components/carousel/carouselProduct";
import CardBijou from "@/components/product-cards/card-bijou";
import { Price } from "@/components/ui/price";
import { TrustList } from "@/components/shop/trust-list";
import { addProductToCart } from "@/components/shop/add-to-cart";
import { btnPrimary, btnSecondary } from "@/components/ui/cta";
import { PressedLeaf, BranchSprig } from "@/components/botanical/decorations";
import { warmVintage } from "@/components/botanical/backgrounds";

function Details({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-olive-100" open={open}>
      <summary className="flex items-center justify-between cursor-pointer list-none py-4 font-editorial text-[0.72rem] tracking-[0.18em] uppercase text-olive-800 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="w-4 h-4 text-olive-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 font-editorial text-[0.9rem] text-olive-700 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

export default function ProductView({
  bijou,
  related,
}: {
  bijou: Bijou;
  related: Bijou[];
}) {
  const soldOut = bijou.stock <= 0;
  const [state, setState] = useState<"idle" | "pending" | "added">("idle");
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const slides =
    bijou.imageGallery && bijou.imageGallery.length > 0
      ? bijou.imageGallery
      : bijou.highlightedImg
        ? [{ _key: "main", _type: "image", ...bijou.highlightedImg }]
        : [];

  // Barre d'achat collante sur mobile quand le bouton principal sort de l'écran.
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  async function add() {
    setState("pending");
    const ok = await addProductToCart(bijou);
    setState(ok ? "added" : "idle");
    if (ok) setTimeout(() => setState("idle"), 2500);
  }

  const addLabel =
    state === "pending"
      ? "Ajout…"
      : state === "added"
        ? "Ajouté au panier"
        : "Ajouter au panier";
  const fleurs = bijou.fleurs?.map((f) => f.title).join(", ");
  const matieres = bijou.matieres?.map((m) => m.title).join(", ");
  const mainCategory = bijou.categories?.[0];

  return (
    <div style={warmVintage} className="relative overflow-x-clip">
      <PressedLeaf className="pointer-events-none absolute top-[20%] right-0 w-32 md:w-44 text-olive-400/10 rotate-[20deg]" />
      <BranchSprig className="pointer-events-none absolute bottom-[30%] left-0 w-40 md:w-56 text-sage-400/10 -rotate-6" />

      <div
        className={`relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8 ${soldOut ? "pb-16" : "pb-28 lg:pb-16"}`}
      >
        <nav
          aria-label="Fil d'Ariane"
          className="font-editorial text-[0.72rem] text-olive-500 mb-4 truncate"
        >
          <Link href="/boutique-bijou" className="hover:text-olive-800">
            Boutique
          </Link>
          {mainCategory && (
            <>
              {" "}
              <span aria-hidden>/</span>{" "}
              <Link
                href={`/boutique-bijou?category=${mainCategory._id}`}
                className="hover:text-olive-800"
              >
                {mainCategory.title}
              </Link>
            </>
          )}{" "}
          <span aria-hidden>/</span>{" "}
          <span className="text-olive-700">{bijou.name}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-14">
          {/* Galerie */}
          <div className="-mx-4 sm:mx-0 lg:sticky lg:top-24 lg:self-start">
            <div className="sm:rounded-2xl overflow-hidden bg-white/70 sm:border border-olive-100 relative">
              {slides.length > 0 && (
                <CarouselProduct slides={slides as any} alt={bijou.name} />
              )}
              {soldOut ? (
                <span className="absolute top-3 left-3 font-editorial text-[0.65rem] tracking-[0.12em] uppercase bg-white/95 text-olive-700 px-3 py-1.5 rounded-full">
                  Épuisé
                </span>
              ) : (
                hasPromo(bijou) && (
                  <span className="absolute top-3 left-3 font-editorial text-[0.65rem] tracking-[0.1em] uppercase bg-bronze-500 text-white px-3 py-1.5 rounded-full">
                    −{bijou.promotionDiscount}%
                  </span>
                )
              )}
            </div>
          </div>

          {/* Infos */}
          <div className="flex flex-col">
            <span className="font-hand text-xl text-bronze-500">
              Pièce artisanale
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl text-olive-900 leading-tight mt-1">
              {bijou.name}
            </h1>
            <div className="mt-4">
              <Price item={bijou} size="lg" />
              <p className="font-editorial text-[0.75rem] text-olive-500 mt-1">
                Prix TTC · livraison {SHIPPING.cost.toLocaleString("fr-FR")} €,
                offerte dès {SHIPPING.freeThreshold} €
              </p>
            </div>

            <p
              className={`mt-5 flex items-center gap-2 font-editorial text-[0.85rem] ${soldOut ? "text-olive-500" : "text-sage-600"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${soldOut ? "bg-olive-300" : "bg-sage-400"}`}
                aria-hidden
              />
              {soldOut
                ? "Cette pièce a trouvé preneur"
                : bijou.stock === 1
                  ? "En stock — pièce unique, prête à être expédiée"
                  : "En stock, prêt à être expédié"}
            </p>

            <div ref={ctaRef} className="mt-5 flex flex-col gap-3">
              {soldOut ? (
                <>
                  <Link
                    href={`/sur-mesure?inspiration=${encodeURIComponent(bijou.name)}`}
                    className={`${btnPrimary} w-full`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Demander une création similaire
                  </Link>
                  <Link
                    href="/boutique-bijou?dispo=1"
                    className={`${btnSecondary} w-full`}
                  >
                    Voir les pièces disponibles
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={add}
                  disabled={state === "pending"}
                  className={`${btnPrimary} w-full`}
                >
                  {state === "added" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  {addLabel}
                </button>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-white/70 border border-olive-100 p-4">
              <TrustList />
            </div>

            <div className="mt-6">
              {bijou.description && bijou.description.length > 0 && (
                <Details title="Description" open>
                  <div className="space-y-3">
                    <PortableText value={bijou.description as any} />
                  </div>
                </Details>
              )}
              {(fleurs || matieres) && (
                <Details title="Composition">
                  <ul className="space-y-1.5">
                    {fleurs && (
                      <li>
                        <span className="text-olive-900">Fleurs :</span>{" "}
                        {fleurs}
                      </li>
                    )}
                    {matieres && (
                      <li>
                        <span className="text-olive-900">Matières :</span>{" "}
                        {matieres}
                      </li>
                    )}
                    <li>
                      Fleurs naturelles séchées, sans perçage, encapsulées dans
                      une résine cristalline.
                    </li>
                  </ul>
                </Details>
              )}
              <Details title="Entretien">
                <p>
                  Pour que votre bijou garde son éclat : retirez-le pour vous
                  doucher, nager ou dormir, évitez le parfum et les crèmes à son
                  contact, et rangez-le à l&apos;abri de la lumière directe du
                  soleil. Un chiffon doux suffit à le nettoyer.
                </p>
              </Details>
              <Details title="Livraison & retours">
                <p>
                  Livraison suivie en France et dans la zone euro :{" "}
                  {SHIPPING.cost.toLocaleString("fr-FR")} €, offerte dès{" "}
                  {SHIPPING.freeThreshold} € d&apos;achat. {SHIPPING.delay}.
                  Vous disposez de 14 jours après réception pour changer
                  d&apos;avis.{" "}
                  <Link
                    href="/cgv#livraison"
                    className="underline underline-offset-2"
                  >
                    Tous les détails
                  </Link>
                </p>
              </Details>
              <Details title="Une question ?">
                <p>
                  Taille, couleur, idée cadeau… écrivez-moi, je vous réponds
                  personnellement.{" "}
                  <Link
                    href={`/contact?objet=Informations&bijou=${encodeURIComponent(bijou.name)}`}
                    className="underline underline-offset-2"
                  >
                    Poser une question sur ce bijou
                  </Link>
                </p>
              </Details>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-hand text-xl text-bronze-500">
                  Dans le même esprit
                </span>
                <h2
                  id="related-title"
                  className="font-serif-display text-2xl md:text-3xl text-olive-800"
                >
                  Vous aimerez aussi
                </h2>
              </div>
              <Link
                href="/boutique-bijou"
                className="font-editorial text-[0.75rem] tracking-[0.12em] uppercase text-olive-700 underline underline-offset-4 whitespace-nowrap"
              >
                Tout voir
              </Link>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-8">
              {related.map((b) => (
                <li key={b._id}>
                  <CardBijou item={b} sizes="(max-width: 768px) 50vw, 25vw" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Barre d'achat collante (mobile) */}
      {!soldOut && (
        <div
          className={`lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-olive-100 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
            showBar ? "translate-y-0" : "translate-y-full"
          }`}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            {bijou.highlightedImg && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream-200">
                <Image
                  src={urlForImage(bijou.highlightedImg, 120)}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-editorial text-[0.8rem] text-olive-900 truncate">
                {bijou.name}
              </p>
              <Price item={bijou} size="sm" />
            </div>
            <button
              type="button"
              onClick={add}
              disabled={state === "pending"}
              tabIndex={showBar ? 0 : -1}
              className="flex-shrink-0 h-11 px-5 rounded-full bg-olive-700 text-cream-50 font-editorial text-[0.7rem] tracking-[0.12em] uppercase flex items-center gap-2 disabled:opacity-60"
            >
              {state === "added" ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              {state === "added" ? "Ajouté" : "Ajouter"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
