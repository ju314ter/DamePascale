"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { usePanier, Item } from "@/store/panier-store";
import { deliverySchema, DeliveryFormData } from "@/components/panier/panier";
import { createCheckoutSession } from "@/app/(main)/(context)/actions";
import { verifyStock } from "@/sanity/lib/client";
import { getCodePromo } from "@/sanity/lib/general/calls";
import { useToast } from "@/components/ui/use-toast";
import ImageWithPlaceholder from "@/components/ui/imageWithPlaceholder";
import { urlForImage } from "@/sanity/lib/image";
import Footer from "@/components/footer/footer";

/* ──────────────────────────── SVG Decorations ──────────────────────────── */

function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="16" stroke="currentColor" strokeWidth="0.8" transform="rotate(288 50 50)" />
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
      <ellipse cx="35" cy="26" rx="4" ry="7" stroke="currentColor" strokeWidth="0.6" transform="rotate(-20 35 26)" />
      <ellipse cx="54" cy="16" rx="4" ry="7" stroke="currentColor" strokeWidth="0.6" transform="rotate(-25 54 16)" />
      <ellipse cx="76" cy="7" rx="3" ry="5" stroke="currentColor" strokeWidth="0.6" transform="rotate(-30 76 7)" />
    </svg>
  );
}

/* ──────────────────────────── Background ──────────────────────────── */

const pageBackground: React.CSSProperties = {
  backgroundImage: `
    radial-gradient(ellipse at 25% 75%, rgba(226,146,59,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 78% 18%, rgba(157,186,154,0.08) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.015) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(170deg, #fefcf7 0%, #fdf8ed 30%, #f9eed5 70%, #fefcf7 100%)
  `,
  backgroundColor: "#fefcf7",
};

/* ──────────────────────────── Recap Item ──────────────────────────── */

const RecapCard = (item: Item) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-olive-100/60 last:border-0">
    <div className="flex-shrink-0 rounded-sm overflow-hidden border border-olive-100/40" style={{ backgroundColor: "#fdf8ed" }}>
      <ImageWithPlaceholder
        src={urlForImage(item.type.highlightedImg)}
        alt={item.type.name}
        width={48}
        height={48}
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-hand text-sm text-olive-700 truncate">{item.type.name}</p>
      <p className="font-editorial text-xs text-olive-500/80">
        {item.qty} ×{" "}
        {item.type.promotionDiscount
          ? (item.type.price * (1 - item.type.promotionDiscount / 100)).toFixed(2)
          : item.type.price.toFixed(2)}{" "}
        €
      </p>
    </div>
    <span className="font-editorial text-sm text-olive-700 flex-shrink-0">
      {(
        (item.type.promotionDiscount
          ? item.type.price * (1 - item.type.promotionDiscount / 100)
          : item.type.price) * item.qty
      ).toFixed(2)}{" "}
      €
    </span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */

export default function CommandePage() {
  const router = useRouter();
  const { panier } = usePanier();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Totals */
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  /* Promo codes fetched from Sanity */
  const [existingCodes, setExistingCodes] = useState<
    { title: string; code: string; type: "absolute" | "percent"; reductionPercent: number }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<DeliveryFormData>({ resolver: zodResolver(deliverySchema) });

  /* Redirect if basket is empty after mount */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && panier.length === 0) {
      router.replace("/boutique-bijou");
    }
  }, [mounted, panier, router]);

  /* Recalculate totals */
  useEffect(() => {
    const total = panier.reduce((acc, item) => {
      return (
        acc +
        (item.type.promotionDiscount
          ? ((100 - item.type.promotionDiscount) / 100) * item.type.price * item.qty
          : item.type.price * item.qty)
      );
    }, 0);
    const fixed = Number(total.toFixed(2));
    setSubtotal(fixed);
    setDeliveryCost(fixed > 50 ? 0 : 4.99);
  }, [panier]);

  /* Fetch promo codes */
  useEffect(() => {
    getCodePromo().then((codes) => {
      if (codes.length > 0) setExistingCodes(codes);
    });
  }, []);

  /* Promo code validation */
  const checkCodePromo = () => {
    const code = getValues("codepromo");
    if (!code || code.trim() === "") {
      setPromoMessage(null);
      setPromoDiscount(null);
      clearErrors("codepromo");
      return;
    }
    const match = existingCodes.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );
    if (match) {
      setPromoMessage(
        `Code "${match.code}" appliqué — ${match.reductionPercent}${match.type === "absolute" ? " €" : " %"} de réduction`
      );
      setPromoDiscount(match.reductionPercent);
      clearErrors("codepromo");
    } else {
      setPromoMessage(null);
      setPromoDiscount(null);
      setError("codepromo", { type: "custom", message: "Code promo invalide" });
    }
  };

  /* Submit */
  const onSubmit = async (formData: DeliveryFormData) => {
    setIsSubmitting(true);
    try {
      const itemsToVerify = panier.map((item) => ({
        id: item.type._id,
        quantity: item.qty,
      }));
      const { allAvailable } = await verifyStock(itemsToVerify);
      if (!allAvailable) {
        toast({
          title: "Impossible de passer la commande",
          description: "Certains produits ne sont plus en stock.",
        });
        return;
      }
      const itemsForCheckout = panier.map((item) => ({
        id: item.type._id,
        qty: item.qty,
      }));
      const result = await createCheckoutSession(itemsForCheckout, formData);
      if (result.error) {
        toast({ title: "Erreur", description: result.error });
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Total after promo */
  const promoSaving =
    promoDiscount !== null ? Number(((subtotal * promoDiscount) / 100).toFixed(2)) : 0;
  const total = Number((subtotal + deliveryCost - promoSaving).toFixed(2));

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative" style={pageBackground}>

      {/* ── Botanical decorations ──────────────────────────────────────────── */}
      <PressedFlower aria-hidden className="pointer-events-none select-none absolute top-[8%] right-[4%] w-20 md:w-28 text-olive-200/20 rotate-12" />
      <BranchSprig aria-hidden className="pointer-events-none select-none absolute bottom-[18%] left-[2%] w-32 md:w-44 text-sage-300/15 rotate-3" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-20 relative z-10">

        {/* Back link */}
        <Link
          href="/boutique-bijou"
          className="inline-flex items-center gap-1.5 font-editorial text-[0.62rem] tracking-[0.15em] uppercase text-olive-400 hover:text-olive-700 transition-colors mb-10"
        >
          <ChevronLeft size={12} strokeWidth={2.5} />
          Continuer mes achats
        </Link>

        {/* Page title */}
        <div className="mb-10">
          <span className="font-hand text-[#c4897a] block mb-2" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}>
            Presque terminé !
          </span>
          <h1
            className="font-serif-display text-olive-900 uppercase tracking-wide leading-[0.9]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3rem)" }}
          >
            Informations de livraison
          </h1>
          <div className="mt-4 w-10 h-px bg-olive-200" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* ── Form (left) ────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

              {/* Section: Identité */}
              <div>
                <p className="font-editorial text-[0.6rem] tracking-[0.2em] uppercase text-olive-500 mb-5">
                  Destinataire
                </p>
                <div className="space-y-6">
                  <FormField label="Nom complet" error={errors.fullName?.message}>
                    <input
                      type="text"
                      placeholder="Marie Dupont"
                      className={inputClass}
                      {...register("fullName")}
                    />
                  </FormField>
                </div>
              </div>

              {/* Section: Adresse */}
              <div>
                <p className="font-editorial text-[0.6rem] tracking-[0.2em] uppercase text-olive-500 mb-5">
                  Adresse de livraison
                </p>
                <div className="space-y-6">
                  <FormField label="Adresse ligne 1" error={errors.addressLine1?.message}>
                    <input
                      type="text"
                      placeholder="12 rue des Fleurs"
                      className={inputClass}
                      {...register("addressLine1")}
                    />
                  </FormField>
                  <FormField label="Adresse ligne 2 (optionnel)">
                    <input
                      type="text"
                      placeholder="Bât. B, appt. 3"
                      className={inputClass}
                      {...register("addressLine2")}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField label="Ville" error={errors.city?.message}>
                      <input
                        type="text"
                        placeholder="Paris"
                        className={inputClass}
                        {...register("city")}
                      />
                    </FormField>
                    <FormField label="Code postal" error={errors.postalCode?.message}>
                      <input
                        type="text"
                        placeholder="75001"
                        className={inputClass}
                        {...register("postalCode")}
                      />
                    </FormField>
                  </div>
                  <FormField label="Pays" error={errors.country?.message}>
                    <input
                      type="text"
                      placeholder="France"
                      className={inputClass}
                      {...register("country")}
                    />
                  </FormField>
                </div>
              </div>

              {/* Section: Message */}
              <div>
                <p className="font-editorial text-[0.6rem] tracking-[0.2em] uppercase text-olive-500 mb-5">
                  Note de commande (optionnel)
                </p>
                <textarea
                  rows={3}
                  placeholder="Un message, une précision sur la commande…"
                  className="w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-base text-olive-700 focus:outline-none focus:border-olive-500 transition-colors resize-none placeholder:text-olive-300/50"
                  {...register("message")}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-olive-700 text-cream-50 font-editorial text-sm tracking-[0.2em] uppercase hover:bg-olive-800 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? "Redirection…" : "Confirmer & payer"}
                </button>
                <p className="font-editorial text-[0.58rem] tracking-[0.12em] text-olive-400/60 text-center uppercase mt-3">
                  Paiement sécurisé · Stripe · Visa · Mastercard · PayPal
                </p>
              </div>
            </form>
          </div>

          {/* ── Order recap (right) ────────────────────────────────────────── */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="rounded-xl border border-olive-200/50 bg-white/70 shadow-[0_4px_24px_rgba(139,119,75,0.07)] overflow-hidden">

              {/* Header */}
              <div className="px-5 py-4 border-b border-olive-100/70">
                <h2 className="font-editorial text-[0.62rem] tracking-[0.2em] uppercase text-olive-600">
                  Récapitulatif
                </h2>
              </div>

              {/* Items */}
              <div className="px-5 py-3">
                <AnimatePresence>
                  {panier.map((item) => (
                    <motion.div
                      key={item.type._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <RecapCard {...item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Promo code */}
              <div className="px-5 pb-4 border-t border-olive-100/60">
                <div className="mt-4 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="font-editorial text-[0.6rem] tracking-[0.18em] uppercase text-olive-500 block mb-1.5">
                      Code promo
                    </label>
                    <input
                      type="text"
                      placeholder="FLEURS2025"
                      className="w-full bg-transparent border-0 border-b border-olive-300/40 py-1.5 font-hand text-sm text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50 uppercase"
                      {...register("codepromo")}
                      onBlur={checkCodePromo}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={checkCodePromo}
                    className="flex-shrink-0 px-3 py-1.5 border border-olive-300/60 font-editorial text-[0.6rem] tracking-[0.12em] uppercase text-olive-600 hover:bg-olive-50 transition-colors rounded"
                  >
                    Appliquer
                  </button>
                </div>
                {errors.codepromo && (
                  <p className="font-editorial text-[0.65rem] tracking-[0.08em] text-red-500/80 mt-1.5">
                    {errors.codepromo.message}
                  </p>
                )}
                {promoMessage && !errors.codepromo && (
                  <p className="font-editorial text-[0.65rem] tracking-[0.08em] text-bronze-600 mt-1.5">
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 bg-olive-50/40 border-t border-olive-100/70 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-editorial text-xs text-olive-600">Sous-total</span>
                  <span className="font-editorial text-xs text-olive-700">{subtotal.toFixed(2)} €</span>
                </div>
                {promoSaving > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-editorial text-xs text-bronze-600">Réduction code</span>
                    <span className="font-editorial text-xs text-bronze-600">− {promoSaving.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-editorial text-xs text-olive-600">Livraison</span>
                  <span className="font-editorial text-xs text-olive-700">
                    {deliveryCost > 0 ? `${deliveryCost.toFixed(2)} €` : "Offert"}
                  </span>
                </div>
                {deliveryCost > 0 && (
                  <p className="font-editorial text-[0.6rem] italic text-bronze-500">
                    Livraison offerte dès 50 €
                  </p>
                )}
                <div className="flex justify-between items-center pt-2.5 border-t border-olive-200/40">
                  <span className="font-editorial text-sm font-medium uppercase tracking-wider text-olive-800">
                    Total
                  </span>
                  <span className="font-hand text-xl text-olive-900">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const inputClass =
  "w-full bg-transparent border-0 border-b border-olive-300/40 py-2 font-hand text-base text-olive-700 focus:outline-none focus:border-olive-500 transition-colors placeholder:text-olive-300/50";

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-editorial text-[0.68rem] tracking-[0.16em] uppercase text-olive-600 block mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-editorial text-[0.65rem] tracking-[0.08em] text-red-500/80 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
