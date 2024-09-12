// app/actions/stripe.js
"use server";

import { Item } from "@/store/panier-store";
import Stripe from "stripe";
import { headers } from "next/headers";
import { updateSanityStock } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

export async function handleStripeWebhook(formData: FormData) {
  const body = (await formData.get("body")) as string;
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return { error: `Webhook Error: ${err.message}` };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Récupérez les informations de la commande
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Mettez à jour le stock dans Sanity
    try {
      await updateSanityStock(lineItems.data);
      console.log("Stock mis à jour dans Sanity");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du stock dans Sanity:",
        error
      );
      return { error: "Erreur lors de la mise à jour du stock" };
    }
  }

  return { received: true };
}
