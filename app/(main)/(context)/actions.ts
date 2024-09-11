// app/actions/stripe.js
"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(data: {
  product: string;
  price: number;
  quantity: number;
}) {
  const { product, price, quantity } = data;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product,
            },
            unit_amount: price * 100, // Stripe utilise les centimes
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return { error: "Impossible de créer la session de paiement." };
  }
}
