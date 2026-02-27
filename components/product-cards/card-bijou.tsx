"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Bijou } from "@/sanity/lib/bijoux/calls";
import { usePanier } from "@/store/panier-store";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { urlForImage } from "@/sanity/lib/image";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";

interface CardBijouProps {
  item: Bijou;
}

const CardBijou = ({ item }: CardBijouProps) => {
  const { addToPanier, removeFromPanier } = usePanier();
  const isOutOfStock = item.stock === 0;

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col ${
        isOutOfStock
          ? "border border-red-200/80 hover:shadow-red-100/60 hover:shadow-md"
          : "border border-olive-100/60 hover:shadow-md"
      }`}
    >
      {/* Image area */}
      <Link href={`/boutique-bijou/${item._id}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-olive-50/50">
          {/* Promotion badge — guard > 0 to avoid rendering "0" */}
          {item.promotionDiscount != null && item.promotionDiscount > 0 && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="font-editorial text-[0.58rem] tracking-[0.08em] uppercase text-white bg-bronze-500 px-2 py-0.5 rounded-full">
                -{item.promotionDiscount}%
              </span>
            </div>
          )}

          <ImageWithPlaceholder
            src={urlForImage(item.highlightedImg)}
            alt={item.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      {/* Text + actions area */}
      <div className="flex flex-col items-center px-4 pt-4 pb-4 gap-3 flex-1">
        <Link
          href={`/boutique-bijou/${item._id}`}
          className="block w-full text-center"
        >
          <p className="font-editorial text-[0.8rem] text-olive-800 leading-snug line-clamp-2 hover:text-bronze-600 transition-colors">
            {item.name}
          </p>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          {item.promotionDiscount != null && item.promotionDiscount > 0 ? (
            <>
              <span className="font-editorial text-sm text-olive-300 line-through">
                {item.price}€
              </span>
              <span className="font-editorial text-base font-medium text-bronze-600">
                {(item.price * (1 - item.promotionDiscount / 100)).toFixed(2)}€
              </span>
            </>
          ) : (
            <span className="font-editorial text-base font-medium text-olive-700">
              {item.price}€
            </span>
          )}
        </div>

        {/* Add to cart / Out of stock */}
        {isOutOfStock ? (
          <div className="mt-auto w-full py-1.5 border border-red-200 font-editorial text-[0.6rem] tracking-[0.18em] uppercase rounded-lg text-red-400 flex items-center justify-center gap-1.5">
            Épuisé
          </div>
        ) : (
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                const message = await addToPanier(item);
                toast({
                  title: message,
                  action: (
                    <ToastAction
                      altText="Retirer du panier"
                      onClick={() => removeFromPanier(item)}
                    >
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
            className="mt-auto w-full py-1.5 bg-olive-700 text-white font-editorial text-[0.6rem] tracking-[0.18em] uppercase rounded-lg hover:bg-olive-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart size={10} strokeWidth={1.8} />
            Ajouter
          </button>
        )}
      </div>
    </div>
  );
};

export default CardBijou;
