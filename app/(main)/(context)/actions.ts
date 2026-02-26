// app/actions/stripe.js
"use server";

import Stripe from "stripe";
import { headers } from "next/headers";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
import { createClient } from "next-sanity";
import { DeliveryFormData } from "@/components/panier/panier";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { getCodePromo } from "@/sanity/lib/general/calls";

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

type CheckoutItemInput = {
  id: string;
  qty: number;
};

type SanityProduct = {
  _id: string;
  name: string;
  price: number;
  promotionDiscount?: number;
  stock: number;
};

function normalizeCheckoutItems(items: CheckoutItemInput[]) {
  return items
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      qty: Math.max(0, Math.floor(Number(item.qty))),
    }))
    .filter((item) => item.id.length > 0 && item.qty > 0);
}

async function fetchProductsByIds(ids: string[]) {
  const query = `*[_id in $ids]{
    _id,
    name,
    price,
    promotionDiscount,
    stock
  }`;
  const products: SanityProduct[] = await client.fetch(query, { ids });
  const productById = new Map(
    products.map((product) => [product._id, product])
  );
  return productById;
}

export async function updateSanityStock(items: CheckoutItemInput[]) {
  const normalizedItems = normalizeCheckoutItems(items);
  if (normalizedItems.length === 0) {
    console.log("Aucun produit a mettre a jour dans le stock");
    return;
  }

  const ids = normalizedItems.map((item) => item.id);
  const productById = await fetchProductsByIds(ids);

  for (const item of normalizedItems) {
    const product = productById.get(item.id);
    if (!product) {
      console.log(`Produit non trouvé: ${item.id}`);
      continue;
    }

    const updatedStock = Math.max(0, product.stock - item.qty);
    await client.patch(product._id).set({ stock: updatedStock }).commit();

    console.log(`Stock mis à jour pour ${product.name}: ${updatedStock}`);
  }
}

export async function createCheckoutSession(
  panier: CheckoutItemInput[],
  formData: DeliveryFormData
): Promise<{ error?: string; url?: string }> {
  try {
    let codeDiscountPercent: Number | undefined = undefined;

    if (formData.codepromo) {
      const codes = await getCodePromo();

      const isCodeValid = codes?.some(
        (code) => code.code.toLowerCase() === formData.codepromo?.toLowerCase()
      );

      if (isCodeValid)
        codeDiscountPercent = codes?.find(
          (code) =>
            code.code.toLowerCase() === formData.codepromo?.toLowerCase()
        )?.reductionPercent;
    }

    const normalizedItems = normalizeCheckoutItems(panier);
    if (normalizedItems.length === 0) {
      return { error: "Panier vide ou invalide." };
    }

    const ids = normalizedItems.map((item) => item.id);
    const productById = await fetchProductsByIds(ids);

    const missingProducts = normalizedItems.filter(
      (item) => !productById.has(item.id)
    );
    if (missingProducts.length > 0) {
      return { error: "Certains produits sont introuvables." };
    }

    const insufficientStock = normalizedItems.filter((item) => {
      const product = productById.get(item.id);
      return product ? product.stock < item.qty : true;
    });
    if (insufficientStock.length > 0) {
      return { error: "Certains produits ne sont plus en stock." };
    }

    let subtotalCents = 0;

    const productLineItems = normalizedItems.map((item) => {
      const product = productById.get(item.id) as SanityProduct;
      const unitAmountRaw = Math.round(product.price * 100);
      const unitAmountDiscounted = product.promotionDiscount
        ? Math.round((unitAmountRaw * (100 - product.promotionDiscount)) / 100)
        : unitAmountRaw;
      const unitAmountFinal =
        codeDiscountPercent !== undefined
          ? Math.round(
              unitAmountDiscounted * (1 - Number(codeDiscountPercent) / 100)
            )
          : unitAmountDiscounted;

      subtotalCents += unitAmountDiscounted * item.qty;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            metadata: {
              productId: product._id,
            },
          },
          unit_amount: unitAmountFinal,
        },
        quantity: item.qty,
      };
    });

    const deliveryCostCents = subtotalCents > 5000 ? 0 : 499;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "link", "paypal"],
      line_items: [
        ...productLineItems,
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Frais de livraison",
            },
            unit_amount: deliveryCostCents,
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
        items: JSON.stringify(normalizedItems),
      },
    } as Stripe.Checkout.SessionCreateParams);
    if (session.url) {
      return { url: session.url };
    }
    return { error: "Impossible de créer la session de paiement." };
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

    const itemsRaw = session.metadata.items;
    if (!itemsRaw) {
      return {
        error: "Erreur lors de la création de la session. Produits manquants.",
      };
    }

    let parsedItems: CheckoutItemInput[] = [];
    try {
      const parsed = JSON.parse(itemsRaw);
      if (Array.isArray(parsed)) {
        parsedItems = parsed;
      }
    } catch (error) {
      console.error("Erreur lors du parsing des items de commande:", error);
      return { error: "Erreur lors de la récupération des produits." };
    }
    if (parsedItems.length === 0) {
      return { error: "Erreur lors de la récupération des produits." };
    }

    // Récupérez les informations de la commande
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Mettez à jour le stock dans Sanity
    try {
      await updateSanityStock(parsedItems);
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
          metadata: {
            ...session.metadata,
            email:
              session.customer_email ||
              session.customer_details?.email ||
              session.metadata.email,
          },
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

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    const resultReceiptMail = await sendReceiptEmail(charge);
    if (!resultReceiptMail.success) {
      console.error(resultReceiptMail.message);
      return { error: resultReceiptMail.message };
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
    text: `Une nouvelle commande a été créée pour ${session.metadata.fullName} (${session.customer_email || session.customer_details?.email || session.metadata.email}).`,
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

const sendReceiptEmail = async (charge: Stripe.Charge) => {
  if (!charge.receipt_url || !charge.billing_details?.email) {
    console.log("Données manquantes pour envoi mail de reçu", charge);
    return {
      success: false,
      message: "Données manquantes pour envoi mail de reçu",
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
    to: charge.billing_details.email,
    subject: `Dame Pascale: Votre reçu stripe`,
    text: `Bonjour, votre paiement a été validé, voici votre reçu stripe : ${charge.receipt_url}`,
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
    return {
      success: true,
      message: "Mail de reçu envoyé avec succès ! A bientôt.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        "Erreur lors de l'envoi du mail de reçu. Veuillez réessayer plus tard.",
    };
  }
};
