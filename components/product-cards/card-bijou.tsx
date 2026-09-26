"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { Bijou } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";
import { hasPromo } from "@/lib/pricing";
import { Price } from "@/components/ui/price";
import { addProductToCart } from "@/components/shop/add-to-cart";
import { isInStock } from "@/lib/stock";

export default function CardBijou({
  item,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  item: Bijou;
  priority?: boolean;
  sizes?: string;
}) {
  const soldOut = !isInStock(item);
  const [state, setState] = useState<"idle" | "pending" | "added">("idle");
  const secondImage = item.imageGallery?.find(
    (img) =>
      img?.asset?._ref && img.asset._ref !== item.highlightedImg?.asset?._ref,
  );
  const href = `/boutique-bijou/${item._id}`;

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link
          href={href}
          className="block relative aspect-[4/5] overflow-hidden rounded-xl bg-cream-200"
        >
          {item.highlightedImg && (
            <Image
              src={urlForImage(item.highlightedImg, 800)}
              alt={item.name}
              fill
              sizes={sizes}
              priority={priority}
              className={`object-cover transition-all duration-700 group-hover:scale-[1.03] ${soldOut ? "opacity-60 grayscale-[30%]" : ""} ${secondImage ? "md:group-hover:opacity-0" : ""}`}
            />
          )}
          {secondImage && (
            <Image
              src={urlForImage(secondImage, 800)}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 hidden md:block md:group-hover:opacity-100"
            />
          )}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {soldOut ? (
              <span className="font-editorial text-[0.6rem] tracking-[0.12em] uppercase bg-white/90 text-olive-700 px-2.5 py-1 rounded-full">
                Épuisé
              </span>
            ) : (
              hasPromo(item) && (
                <span className="font-editorial text-[0.6rem] tracking-[0.1em] uppercase bg-bronze-500 text-white px-2.5 py-1 rounded-full">
                  −{item.promotionDiscount}%
                </span>
              )
            )}
          </div>
        </Link>

        {!soldOut && (
          <button
            type="button"
            disabled={state === "pending"}
            onClick={async () => {
              setState("pending");
              const ok = await addProductToCart(item);
              setState(ok ? "added" : "idle");
              if (ok) setTimeout(() => setState("idle"), 1800);
            }}
            className="absolute right-2.5 bottom-2.5 w-11 h-11 rounded-full bg-white/95 text-olive-800 shadow-[0_4px_14px_rgba(96,78,48,0.18)] flex items-center justify-center transition-all hover:bg-olive-700 hover:text-white disabled:opacity-70 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus-visible:opacity-100"
            aria-label={`Ajouter ${item.name} au panier`}
          >
            {state === "added" ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus
                className={`w-5 h-5 ${state === "pending" ? "animate-pulse" : ""}`}
              />
            )}
          </button>
        )}
      </div>

      <Link href={href} className="pt-3 px-0.5 flex flex-col gap-1">
        <h3 className="font-editorial text-[0.85rem] md:text-[0.92rem] text-olive-900 leading-snug line-clamp-2 group-hover:text-bronze-600 transition-colors">
          {item.name}
        </h3>
        <Price item={item} size="sm" />
      </Link>
    </article>
  );
}
