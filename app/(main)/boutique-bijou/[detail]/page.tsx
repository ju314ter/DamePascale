"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Bijou, getBijouById } from "@/sanity/lib/bijoux/calls";
import { usePanier } from "@/store/panier-store";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CarouselProduct } from "@/components/carousel/carouselProduct";
import { PortableText } from "@portabletext/react";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

function PressedLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 C20 30, 10 60, 40 110 C70 60, 60 30, 40 10Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M40 10 L40 110" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 35 L25 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L22 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L24 60" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 35 L55 25" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 50 L58 42" stroke="currentColor" strokeWidth="0.6" />
      <path d="M40 65 L56 60" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function BranchSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 Q40 45, 60 30 Q80 15, 110 10" stroke="currentColor" strokeWidth="1" />
      <path d="M30 47 C25 38, 28 30, 35 28" stroke="currentColor" strokeWidth="0.7" />
      <path d="M50 36 C43 28, 46 20, 54 18" stroke="currentColor" strokeWidth="0.7" />
      <path d="M70 24 C64 18, 68 10, 76 9" stroke="currentColor" strokeWidth="0.7" />
      <path d="M90 15 C86 10, 90 4, 96 5" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}

function SmallBlossom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(90 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(180 30 30)" />
      <ellipse cx="30" cy="18" rx="5" ry="10" stroke="currentColor" strokeWidth="0.7" transform="rotate(270 30 30)" />
    </svg>
  );
}

const pageBackground = {
  backgroundImage: `
    radial-gradient(ellipse at 20% 80%, rgba(226,146,59,0.07) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(160deg, #fefcf7 0%, #fdf8ed 40%, #f9eed5 75%, #fefcf7 100%)
  `,
  backgroundColor: "#fefcf7",
};

/* ─────────────────────────────────────────────────────────────────────────── */

const ProductDetailBijouPage = () => {
  const params = useParams();
  const [bijou, setBijou] = useState<Bijou | null>(null);
  const { addToPanier, removeFromPanier } = usePanier();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBijou() {
      if (typeof params.detail === "string") {
        const data = await getBijouById(params.detail);
        setBijou(data);
      }
    }
    fetchBijou();
  }, [params]);

  if (!bijou) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={pageBackground}>
        <div className="text-center">
          <SmallBlossom className="w-10 h-10 text-olive-300 mx-auto mb-4 animate-pulse" />
          <p className="font-editorial text-[0.65rem] tracking-[0.22em] uppercase text-olive-400">
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  const discountedPrice = bijou.promotionDiscount
    ? bijou.price * (1 - bijou.promotionDiscount / 100)
    : null;

  return (
    <div className="min-h-screen relative" style={pageBackground}>

      {/* ── Botanical decorations ──────────────────────────────────────────── */}
      <PressedLeaf aria-hidden className="pointer-events-none select-none absolute top-[18%] right-0 w-32 md:w-44 text-olive-400/[0.11] rotate-[20deg]" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute bottom-[22%] left-0 w-40 md:w-56 text-sage-400/[0.10] -rotate-[7deg]" />
      <SmallBlossom aria-hidden className="pointer-events-none select-none absolute top-[62%] right-[4%] w-14 text-bronze-400/[0.09] rotate-[18deg]" />

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-20 relative z-10">

        {/* Back link */}
        <Link
          href="/boutique-bijou"
          className="inline-flex items-center gap-1.5 font-editorial text-[0.62rem] tracking-[0.15em] uppercase text-olive-400 hover:text-olive-700 transition-colors mb-10"
        >
          <ChevronLeft size={12} strokeWidth={2.5} />
          Nos Bijoux
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Carousel ──────────────────────────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden border border-olive-100/70 shadow-[0_8px_40px_rgba(139,119,75,0.09)] bg-white/50">
            <CarouselProduct slides={bijou.imageGallery} />
          </div>

          {/* ── Product info ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5 lg:pt-2">

            {/* Decorative label */}
            <span className="font-hand text-bronze-500" style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}>
              Pièce artisanale
            </span>

            {/* Name */}
            <div>
              <h1
                className="font-serif-display text-olive-900 uppercase tracking-wide leading-[0.9]"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                {bijou.name}
              </h1>
              <div className="mt-4 w-10 h-px bg-olive-200" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {bijou.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="px-2.5 py-1 rounded-full bg-olive-50 border border-olive-200/60 font-editorial text-[0.6rem] tracking-[0.14em] uppercase text-olive-700"
                >
                  {cat.title}
                </span>
              ))}
              {bijou.matieres?.map((mat) => (
                <span
                  key={mat._id}
                  className="px-2.5 py-1 rounded-full bg-olive-50/60 border border-olive-100/60 font-editorial text-[0.6rem] tracking-[0.14em] uppercase text-olive-600"
                >
                  {mat.title}
                </span>
              ))}
              {bijou.fleurs?.map((fleur) => (
                <span
                  key={fleur._id}
                  className="px-2.5 py-1 rounded-full border border-bronze-200/50 font-editorial text-[0.6rem] tracking-[0.14em] uppercase text-bronze-600"
                  style={{ backgroundColor: "rgba(216,120,37,0.06)" }}
                >
                  · {fleur.title}
                </span>
              ))}
              {bijou.promotionDiscount && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-100 font-editorial text-[0.6rem] tracking-[0.14em] uppercase text-red-600">
                  −{bijou.promotionDiscount}%
                </span>
              )}
            </div>

            {/* Description */}
            {bijou.description && (
              <div className="font-editorial text-[0.85rem] text-olive-600/80 leading-relaxed border-t border-olive-100/60 pt-5">
                {Array.isArray(bijou.description) ? (
                  <PortableText value={bijou.description} />
                ) : (
                  <p>{bijou.description}</p>
                )}
              </div>
            )}

            {/* Price */}
            <div className="border-t border-olive-100/60 pt-5 flex items-baseline gap-3">
              {discountedPrice !== null ? (
                <>
                  <span className="font-serif-display text-olive-400/60 line-through" style={{ fontSize: "1.25rem" }}>
                    {bijou.price.toFixed(2)} €
                  </span>
                  <span className="font-serif-display text-olive-900" style={{ fontSize: "2rem" }}>
                    {discountedPrice.toFixed(2)} €
                  </span>
                </>
              ) : (
                <span className="font-serif-display text-olive-900" style={{ fontSize: "2rem" }}>
                  {bijou.price.toFixed(2)} €
                </span>
              )}
            </div>

            {/* CTA */}
            <button
              className="w-full py-3.5 bg-olive-700 text-white font-editorial text-[0.68rem] tracking-[0.22em] uppercase rounded-lg hover:bg-olive-800 active:scale-[0.99] transition-all shadow-sm mt-1"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const message = await addToPanier(bijou);
                  toast({
                    title: message,
                    action: (
                      <ToastAction altText="Retirer du panier" onClick={() => removeFromPanier(bijou)}>
                        Annuler
                      </ToastAction>
                    ),
                  });
                } catch (error) {
                  if (error instanceof Error) {
                    toast({ title: error.message });
                  }
                }
              }}
            >
              Ajouter au panier
            </button>

            {/* Handmade note */}
            <p className="font-editorial text-[0.58rem] tracking-[0.12em] text-olive-400/60 text-center uppercase pt-1">
              Pièce unique · Façonnée à la main · Fleurs naturelles
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBijouPage;
