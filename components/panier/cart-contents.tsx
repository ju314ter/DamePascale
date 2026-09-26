"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2, Lock, Tag, X, ShoppingBag } from "lucide-react";
import { usePanier } from "@/store/panier-store";
import { cartTotals } from "@/lib/cart";
import { finalPrice, formatPrice } from "@/lib/pricing";
import { urlForImage } from "@/sanity/lib/image";
import { SHIPPING } from "@/lib/site";
import { startCheckout, validatePromoCode } from "@/app/actions/shop";
import { btnPrimary } from "@/components/ui/cta";

function FreeShippingMeter({
  subtotal,
  missing,
}: {
  subtotal: number;
  missing: number;
}) {
  const pct = Math.min(100, (subtotal / SHIPPING.freeThreshold) * 100);
  return (
    <div className="rounded-xl bg-sage-50 border border-sage-100 px-4 py-3">
      <p className="font-editorial text-[0.8rem] text-sage-700">
        {missing > 0 ? (
          <>
            Plus que{" "}
            <strong className="text-sage-800">{formatPrice(missing)}</strong>{" "}
            pour la livraison offerte
          </>
        ) : (
          <>🌿 La livraison vous est offerte</>
        )}
      </p>
      <div
        className="mt-2 h-1.5 rounded-full bg-sage-100 overflow-hidden"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-sage-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PromoField() {
  const promo = usePanier((s) => s.promo);
  const setPromo = usePanier((s) => s.setPromo);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-bronze-50 border border-bronze-100 px-3 py-2">
        <span className="flex items-center gap-2 font-editorial text-[0.8rem] text-bronze-700">
          <Tag className="w-3.5 h-3.5" /> Code <strong>{promo.code}</strong> (
          {promo.label})
        </span>
        <button
          type="button"
          onClick={() => setPromo(null)}
          className="p-1 text-bronze-600"
          aria-label="Retirer le code promo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-editorial text-[0.8rem] text-olive-600 underline underline-offset-4 decoration-olive-300 self-start py-1"
      >
        Vous avez un code promo ?
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const result = await validatePromoCode(code);
        setPending(false);
        if (result.ok) {
          setPromo({
            code: result.code,
            type: result.type,
            value: result.value,
            label: result.label,
          });
          setError(null);
        } else setError(result.error);
      }}
    >
      <div className="flex gap-2">
        <label htmlFor="promo" className="sr-only">
          Code promo
        </label>
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="Code promo"
          className="flex-1 min-w-0 rounded-lg border border-olive-200 bg-white px-3 py-2.5 font-editorial text-sm text-olive-900 focus:outline-none focus:border-olive-500"
        />
        <button
          type="submit"
          disabled={pending || !code.trim()}
          className="rounded-lg border border-olive-400 px-4 font-editorial text-[0.7rem] tracking-[0.12em] uppercase text-olive-700 hover:bg-olive-50 disabled:opacity-50"
        >
          {pending ? "…" : "Appliquer"}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 font-editorial text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

/** Contenu du panier : utilisé dans le tiroir et sur la page /commande. */
export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const panier = usePanier((s) => s.panier);
  const promo = usePanier((s) => s.promo);
  const setQty = usePanier((s) => s.setQty);
  const remove = usePanier((s) => s.removeFromPanier);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const totals = cartTotals(panier, promo);

  async function checkout() {
    setPending(true);
    setError(null);
    const result = await startCheckout({
      items: panier.map((l) => ({ id: l.product._id, qty: l.qty })),
      promoCode: promo?.code,
    });
    if (result.url) {
      window.location.href = result.url;
      return;
    }
    setError(result.error ?? "Une erreur est survenue.");
    setPending(false);
  }

  if (panier.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <ShoppingBag
          className="w-12 h-12 text-olive-200 mb-4"
          strokeWidth={1}
        />
        <p className="font-hand text-2xl text-olive-700">
          Votre panier est vide
        </p>
        <p className="font-editorial text-sm text-olive-600 mt-2 mb-6 max-w-xs">
          Chaque pièce est unique : laissez-vous tenter avant qu&apos;elle ne
          trouve preneuse !
        </p>
        <Link
          href="/boutique-bijou"
          onClick={onNavigate}
          className={btnPrimary}
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        <FreeShippingMeter
          subtotal={totals.subtotal}
          missing={totals.missingForFreeShipping}
        />
        <ul className="divide-y divide-olive-100">
          {panier.map(({ product, qty }) => (
            <li key={product._id} className="flex gap-3 py-4">
              <Link
                href={`/boutique-bijou/${product._id}`}
                onClick={onNavigate}
                className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100 border border-olive-100"
              >
                {product.highlightedImg && (
                  <Image
                    src={urlForImage(product.highlightedImg, 200)}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/boutique-bijou/${product._id}`}
                    onClick={onNavigate}
                    className="font-editorial text-[0.9rem] text-olive-900 leading-snug line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product._id)}
                    className="p-1 -mr-1 text-olive-400 hover:text-red-500 self-start"
                    aria-label={`Retirer ${product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <div className="flex items-center rounded-full border border-olive-200">
                    <button
                      type="button"
                      className="w-9 h-9 flex items-center justify-center text-olive-600"
                      aria-label="Diminuer la quantité"
                      onClick={() => setQty(product._id, qty - 1)}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="w-6 text-center font-editorial text-sm"
                      aria-live="polite"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-9 flex items-center justify-center text-olive-600"
                      aria-label="Augmenter la quantité"
                      onClick={async () => {
                        const r = await setQty(product._id, qty + 1);
                        setError(r.ok ? null : r.error);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-editorial text-[0.95rem] text-olive-900">
                    {formatPrice(finalPrice(product) * qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-olive-100 bg-white px-4 sm:px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
        <PromoField />
        <dl className="space-y-1.5 font-editorial text-sm">
          <div className="flex justify-between text-olive-700">
            <dt>Sous-total</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-bronze-600">
              <dt>Réduction</dt>
              <dd>−{formatPrice(totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-olive-700">
            <dt>Livraison</dt>
            <dd>
              {totals.shipping > 0 ? formatPrice(totals.shipping) : "Offerte"}
            </dd>
          </div>
          <div className="flex justify-between text-olive-900 text-base pt-2 border-t border-olive-100">
            <dt>Total</dt>
            <dd className="font-medium">{formatPrice(totals.total)}</dd>
          </div>
        </dl>
        {error && (
          <p
            className="font-editorial text-[0.8rem] text-red-600 bg-red-50 rounded-lg px-3 py-2"
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={checkout}
          disabled={pending}
          className={`${btnPrimary} w-full`}
        >
          <Lock className="w-4 h-4" />
          {pending ? "Ouverture du paiement…" : "Commander en toute sécurité"}
        </button>
        <p className="font-editorial text-[0.7rem] text-olive-500 text-center">
          Carte bancaire, PayPal ou Link · Adresse de livraison à l&apos;étape
          suivante
        </p>
      </div>
    </div>
  );
}
