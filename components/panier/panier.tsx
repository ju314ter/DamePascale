"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ShoppingCart, MinusCircle, ArrowRight } from "lucide-react";
import { usePanier, Item } from "@/store/panier-store";
import ImageWithPlaceholder from "../ui/imageWithPlaceholder";
import { urlForImage } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import Link from "next/link";

/* ── Delivery schema & type — exported for use in actions.ts & commande page ── */

export const deliverySchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  addressLine1: z.string().min(5, "Adresse requise"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(2, "Pays requis"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Code postal invalide"),
  message: z.string().optional(),
  codepromo: z.string().optional(),
});
export type DeliveryFormData = z.infer<typeof deliverySchema>;

/* ─────────────────────────────────────────────────────────────────────────── */

const PanierWrapper = () => {
  const { panier } = usePanier();
  const [totalPanier, setTotalPanier] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);

  useEffect(() => {
    const total = panier.reduce((acc, item) => {
      return (
        acc +
        (item.type.promotionDiscount
          ? ((100 - item.type.promotionDiscount) / 100) * item.type.price
          : item.type.price * item.qty)
      );
    }, 0);
    const fixed = Number(total.toFixed(2));
    setTotalPanier(fixed);
    setDeliveryCost(fixed > 50 ? 0 : 4.99);
  }, [panier]);

  const itemCount = panier.reduce((total, item) => total + item.qty, 0);

  return (
    <Sheet key="right">
      <SheetTrigger asChild>
        <button
          className="relative bg-transparent border-none cursor-pointer p-2 group"
          aria-label="Panier"
        >
          <ShoppingCart
            className="w-6 h-6 text-olive-600 group-hover:text-bronze-500 transition-colors"
            strokeWidth={1.5}
          />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-bronze-500 text-cream-50 text-[0.65rem] font-medium flex items-center justify-center animate-scale origin-center">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col overflow-hidden border-l border-l-olive-200/30 p-0"
        style={{ backgroundColor: "#fefcf7" }}
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-olive-200/20">
          <SheetTitle className="font-hand text-2xl text-olive-700">
            Votre panier
          </SheetTitle>
          <p className="font-editorial text-sm text-olive-600/70">
            Retrouvez toute votre sélection.
          </p>
        </SheetHeader>

        {/* Empty state */}
        {panier.length === 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <ShoppingCart
              className="w-12 h-12 text-olive-300/50 mx-auto mb-4"
              strokeWidth={1}
            />
            <p className="font-editorial text-sm text-olive-600/70">
              Votre panier est vide
            </p>
          </motion.div>
        )}

        {/* Items */}
        {panier.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence>
                {panier.map((item) => (
                  <PanierCard key={item.type._id} {...item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Footer: totals + CTA */}
            <div className="px-6 pt-4 pb-6 border-t border-olive-200/30 flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="font-editorial text-sm text-olive-600">
                  Sous-total
                </span>
                <span className="font-editorial text-sm text-olive-700">
                  {totalPanier.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-editorial text-sm text-olive-600">
                  Livraison estimée
                </span>
                <span className="font-editorial text-sm text-olive-700">
                  {deliveryCost > 0 ? `${deliveryCost.toFixed(2)} €` : "Offert"}
                </span>
              </div>
              {deliveryCost > 0 && (
                <p className="font-editorial text-xs text-bronze-500 italic">
                  Livraison offerte au dessus de 50 €
                </p>
              )}

              <div className="flex justify-between items-center pt-2.5 border-t border-olive-200/20">
                <span className="font-editorial text-sm font-medium uppercase tracking-wider text-olive-800">
                  Total estimé
                </span>
                <span className="font-hand text-xl text-olive-800">
                  {(totalPanier + deliveryCost).toFixed(2)} €
                </span>
              </div>

              <SheetClose asChild>
                <Link
                  href="/commande"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.15em] uppercase hover:bg-olive-800 active:scale-[0.99] transition-all"
                >
                  Passer la commande
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

const PanierCard = (item: Item) => {
  const { removeFromPanier } = usePanier();

  return (
    <motion.div
      key={item.type._id}
      className="w-full flex items-center gap-4 p-3 rounded-sm bg-white/60 border border-olive-200/20"
      layout
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
    >
      <div className="flex-shrink-0">
        <ImageWithPlaceholder
          src={urlForImage(item.type.highlightedImg)}
          alt={item.type.name}
          width={50}
          height={50}
          className="rounded-sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-hand text-base text-olive-700 truncate">
          {item.type.name}
        </p>
        <p className="font-editorial text-xs text-olive-600/70">
          {item.qty} ×{" "}
          {item.type.promotionDiscount
            ? (item.type.price * (1 - item.type.promotionDiscount / 100)).toFixed(2)
            : item.type.price.toFixed(2)}{" "}
          €
        </p>
      </div>
      <button
        className="bg-transparent border-none cursor-pointer p-1 flex-shrink-0"
        aria-label={`Retirer ${item.type.name}`}
        onClick={(e) => {
          e.preventDefault();
          removeFromPanier(item.type);
        }}
      >
        <MinusCircle className="w-5 h-5 text-olive-400 hover:text-red-500 transition-colors" />
      </button>
    </motion.div>
  );
};

export default PanierWrapper;
