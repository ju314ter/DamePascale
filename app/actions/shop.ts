"use server";

import Stripe from "stripe";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import {
  getCodePromo,
  isBoutiqueOpen,
  type CodePromo,
} from "@/sanity/lib/general/calls";
import { finalPrice } from "@/lib/pricing";
import { SHIPPING, siteUrl } from "@/lib/site";

type StockRow = {
  _id: string;
  name: string;
  stock: number;
  price: number;
  promotionDiscount?: number;
};

async function fetchProducts(ids: string[]): Promise<Map<string, StockRow>> {
  const rows = await client.fetch<StockRow[]>(
    groq`*[_type == "bijoux" && _id in $ids]{ _id, name, stock, price, promotionDiscount }`,
    { ids },
  );
  return new Map(rows.map((row) => [row._id, row]));
}

export type CartCheck =
  | { ok: true; stock: number }
  | { ok: false; error: string; stock?: number };

/** Vérifie qu'une quantité est disponible avant de l'ajouter au panier. */
export async function checkCartItem(
  id: string,
  quantity: number,
): Promise<CartCheck> {
  try {
    if (!(await isBoutiqueOpen())) {
      return {
        ok: false,
        error: "La boutique est en pause, revenez très vite !",
      };
    }
    const product = (await fetchProducts([id])).get(id);
    if (!product)
      return { ok: false, error: "Ce bijou n'est plus disponible." };
    if (product.stock < quantity) {
      return {
        ok: false,
        stock: product.stock,
        error:
          product.stock <= 0
            ? `« ${product.name} » vient d'être vendu.`
            : `Il ne reste que ${product.stock} exemplaire${product.stock > 1 ? "s" : ""} de « ${product.name} ».`,
      };
    }
    return { ok: true, stock: product.stock };
  } catch (error) {
    console.error("checkCartItem", error);
    return {
      ok: false,
      error: "Vérification du stock impossible, réessayez dans un instant.",
    };
  }
}

export type PromoResult =
  | {
      ok: true;
      code: string;
      type: CodePromo["type"];
      value: number;
      label: string;
    }
  | { ok: false; error: string };

function findPromo(codes: CodePromo[], raw: string) {
  const wanted = raw.trim().toLowerCase();
  return codes.find((c) => c.code?.trim().toLowerCase() === wanted);
}

function promoLabel(promo: CodePromo) {
  return promo.type === "absolute"
    ? `−${promo.reductionPercent.toLocaleString("fr-FR")} €`
    : `−${promo.reductionPercent} %`;
}

/** Valide un code sans jamais exposer la liste des codes au navigateur. */
export async function validatePromoCode(code: string): Promise<PromoResult> {
  if (!code || code.trim().length < 2)
    return { ok: false, error: "Saisissez un code." };
  const promo = findPromo(await getCodePromo(), code);
  if (!promo || !(promo.reductionPercent > 0))
    return { ok: false, error: "Ce code n'est pas valide." };
  return {
    ok: true,
    code: promo.code,
    type: promo.type,
    value: promo.reductionPercent,
    label: promoLabel(promo),
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing");

/** Crée (ou réutilise) le coupon Stripe correspondant au code promo. */
async function stripeCouponFor(promo: CodePromo): Promise<string> {
  const slug = promo.code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const id = `dp-${slug}-${promo.type}-${String(promo.reductionPercent).replace(".", "_")}`;
  try {
    await stripe.coupons.retrieve(id);
  } catch {
    await stripe.coupons.create({
      id,
      name: `Code ${promo.code}`,
      duration: "once",
      ...(promo.type === "absolute"
        ? {
            amount_off: Math.round(promo.reductionPercent * 100),
            currency: "eur",
          }
        : { percent_off: Math.min(100, promo.reductionPercent) }),
    });
  }
  return id;
}

export type CheckoutInput = {
  items: { id: string; qty: number }[];
  promoCode?: string;
};

/**
 * Crée la session de paiement Stripe. Les prix, le stock et la réduction sont
 * recalculés ici à partir de Sanity : rien de ce qui vient du navigateur
 * n'est pris pour argent comptant.
 */
export async function startCheckout({
  items,
  promoCode,
}: CheckoutInput): Promise<{ url?: string; error?: string }> {
  try {
    if (!(await isBoutiqueOpen())) {
      return {
        error: "La boutique est en pause, les commandes reprennent très vite !",
      };
    }

    const normalized = items
      .map((i) => ({
        id: String(i.id),
        qty: Math.max(0, Math.floor(Number(i.qty))),
      }))
      .filter((i) => i.id && i.qty > 0);
    if (normalized.length === 0) return { error: "Votre panier est vide." };

    const products = await fetchProducts(normalized.map((i) => i.id));
    for (const item of normalized) {
      const product = products.get(item.id);
      if (!product)
        return {
          error:
            "Un des bijoux de votre panier n'existe plus. Retirez-le pour continuer.",
        };
      if (product.stock < item.qty) {
        return {
          error:
            product.stock <= 0
              ? `« ${product.name} » vient d'être vendu. Retirez-le de votre panier pour continuer.`
              : `Il ne reste que ${product.stock} « ${product.name} ».`,
        };
      }
    }

    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      normalized.map((item) => {
        const product = products.get(item.id)!;
        const unit = finalPrice(product);
        subtotal += unit * item.qty;
        return {
          quantity: item.qty,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(unit * 100),
            product_data: {
              name: product.name,
              metadata: { productId: product._id },
            },
          },
        };
      });

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    let appliedCode: string | undefined;
    if (promoCode) {
      const promo = findPromo(await getCodePromo(), promoCode);
      if (!promo || !(promo.reductionPercent > 0))
        return { error: "Le code promo n'est plus valide." };
      discounts = [{ coupon: await stripeCouponFor(promo) }];
      appliedCode = promo.code;
    }

    const freeShipping = subtotal >= SHIPPING.freeThreshold;
    const base = siteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      payment_method_types: ["card", "link", "paypal"],
      line_items: lineItems,
      discounts,
      shipping_address_collection: {
        allowed_countries: [
          ...SHIPPING.countries,
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: freeShipping
              ? "Livraison offerte"
              : "Livraison suivie",
            fixed_amount: {
              amount: freeShipping ? 0 : Math.round(SHIPPING.cost * 100),
              currency: "eur",
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: "message",
          label: {
            type: "custom",
            custom: "Un message ? (cadeau, précision…)",
          },
          type: "text",
          optional: true,
        },
      ],
      custom_text: {
        submit: {
          message:
            "Chaque bijou est emballé à la main avec soin. Merci pour votre confiance !",
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + 45 * 60,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
      metadata: {
        items: JSON.stringify(normalized),
        promoCode: appliedCode ?? "",
      },
    });

    return session.url
      ? { url: session.url }
      : { error: "Impossible d'ouvrir le paiement." };
  } catch (error) {
    console.error("startCheckout", error);
    return {
      error:
        "Le paiement est momentanément indisponible. Réessayez dans un instant.",
    };
  }
}
