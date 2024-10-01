// app/actions/stripe.js
"use server";

import { Item } from "@/store/panier-store";
import Stripe from "stripe";
import { headers } from "next/headers";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
import { createClient } from "next-sanity";
import { DeliveryFormData } from "@/components/panier/panier";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  token: process.env.SANITY_TOKEN,
});

export async function updateSanityStock(lineItems: Stripe.LineItem[]) {
  for (const item of lineItems) {
    const productName = item.description;
    const quantitySold = item.quantity || 0;

    // Recherchez le produit dans Sanity
    const query = `*[name == $productName][0]`;
    const product = await client.fetch(query, { productName });

    if (product) {
      // Mettez à jour le stock
      const updatedStock = Math.max(0, product.stock - quantitySold);
      await client.patch(product._id).set({ stock: updatedStock }).commit();

      console.log(`Stock mis à jour pour ${productName}: ${updatedStock}`);
    } else {
      if (productName !== "Frais de livraison")
        console.log(`Produit non trouvé: ${productName}`);
    }
  }
}

export async function createCheckoutSession(
  panier: Item[],
  formData: DeliveryFormData,
  deliveryCost: number
) {
  try {
    const session = await stripe.checkout.sessions.create({
      // TODO : ajouter 'paypal' lorsque paypal sera activé coté stripe (necessite compte paypal pro)
      payment_method_types: ["card", "link"],
      line_items: [
        ...panier.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.type.name,
            },
            unit_amount: item.type.promotionDiscount
              ? (
                  ((100 - item.type.promotionDiscount) / 100) *
                  item.type.price *
                  100
                ).toFixed(0)
              : (item.type.price * 100).toFixed(0), // Stripe utilise les centimes
          },
          quantity: item.qty,
        })),
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Frais de livraison",
            },
            unit_amount: deliveryCost * 100, // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancel_url: `http://${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
      metadata: {
        message: formData.message,
        fullName: formData.fullName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
      },
    } as Stripe.Checkout.SessionCreateParams);

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

    if (!session.metadata) {
      return {
        error:
          "Erreur lors de la création de la session de paiement. Metadata manquante.",
      };
    }
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

    // Transfert des metadonnées de la session checkout au payment intent
    if (session.payment_intent) {
      try {
        await stripe.paymentIntents.update(session.payment_intent as string, {
          metadata: session.metadata,
        });
      } catch (error) {
        console.error(
          "Erreur lors du transfert des métadonnées au Payment Intent:",
          error
        );
        return { error: "Erreur lors du transfert des métadonnées" };
      }
    }

    // Envoi mail de confirmation utiliseur + envoi mail notification nouvelle commande
    const resultMailCustomer = await sendConfirmationEmail(
      session,
      lineItems.data
    );
    if (!resultMailCustomer.success) {
      console.error(resultMailCustomer.message);
      return { error: resultMailCustomer.message };
    }
    const resultMailNotification = await sendNotificationEmail(session);
    if (!resultMailNotification.success) {
      console.error(resultMailCustomer.message);
      return { error: resultMailNotification.message };
    }
  }

  return { received: true };
}

const sendConfirmationEmail = async (
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
) => {
  if (
    !session.metadata ||
    !session.customer_details ||
    !session.customer_details.email
  ) {
    return {
      success: false,
      message: "Données manquantes pour envoi mail de confirmation commande",
    };
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_GMAIL_APP_PASSWORD,
    },
  });

  const text = `Bonjour ${session.metadata.fullName},
Nous avons bien reçu votre commande et nous vous remercions de votre confiance.
Voici le résumé de votre commande:

${lineItems
  .map((item) => {
    const name = item.description;
    const quantitySold = item.quantity || 0;
    const price = item.price?.unit_amount || 0;
    return `- ${name} - ${quantitySold} x ${((price * quantitySold) / 100).toFixed(2)} €`;
  })
  .join("\n")}

Total: ${session.amount_total ? (session.amount_total / 100).toFixed(2) : "unknown"} €

Bonne journée !`;

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: session.customer_details.email,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Dame Pascale: Confirmation de votre commande`,
    text,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email envoyé");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return { success: true, message: "Mail envoyé avec succès ! A bientôt." };
  } catch (err) {
    return {
      success: false,
      message: "Erreur lors de l'envoi du mail. Veuillez réessayer plus tard.",
    };
  }
};

const sendNotificationEmail = async (session: Stripe.Checkout.Session) => {
  if (!session.metadata) {
    return {
      success: false,
      message: "Données manquantes pour envoi notification commande",
    };
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    subject: `Dame Pascale: Confirmation de votre commande`,
    text: `Une nouvelle commande a été créée pour ${session.metadata.fullName} (${session.customer_email}).`,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email envoyé");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return { success: true, message: "Mail envoyé avec succès ! A bientôt." };
  } catch (err) {
    return {
      success: false,
      message: "Erreur lors de l'envoi du mail. Veuillez réessayer plus tard.",
    };
  }
};
