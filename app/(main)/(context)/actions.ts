// app/actions/stripe.js
"use server";

import { Item } from "@/store/panier-store";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(panier: Item[]) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "link", "paypal"],
      line_items: [
        ...panier.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.type.name,
            },
            unit_amount: item.type.promotionDiscount
              ? ((100 - item.type.promotionDiscount) / 100) *
                item.type.price *
                100
              : item.type.price * 100, // Stripe utilise les centimes
          },
          quantity: item.qty,
        })),
      ],
      mode: "payment",
      success_url: `http://${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancel_url: `http://${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return { error: "Impossible de créer la session de paiement." };
  }
}
