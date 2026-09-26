import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { escapeHtml, mailLayout, mailRows, sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing");

type OrderItem = { id: string; qty: number };

function parseItems(raw: string | undefined): OrderItem[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed)
      ? parsed
          .map((i) => ({
            id: String(i.id),
            qty: Math.max(0, Math.floor(Number(i.qty))),
          }))
          .filter((i) => i.id && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function formatAddress(
  details: Stripe.Checkout.Session.ShippingDetails | null | undefined,
) {
  const a = details?.address;
  if (!a) return "";
  return [
    details?.name,
    a.line1,
    a.line2,
    `${a.postal_code ?? ""} ${a.city ?? ""}`.trim(),
    a.country,
  ]
    .filter(Boolean)
    .join("\n");
}

const euros = (cents: number | null | undefined) =>
  ((cents ?? 0) / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

async function handleCompletedSession(session: Stripe.Checkout.Session) {
  const items = parseItems(session.metadata?.items);
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });
  const shipping =
    (session as any).shipping_details ??
    (session as any).collected_information?.shipping_details;
  const customerName =
    shipping?.name || session.customer_details?.name || "Client";
  const email = session.customer_details?.email || "";
  const message =
    session.custom_fields?.find((f) => f.key === "message")?.text?.value || "";
  const address = formatAddress(shipping);

  // Idempotence : la commande porte l'identifiant de la session Stripe. Si Stripe
  // renvoie l'événement, la création échoue et le stock n'est pas décompté deux fois.
  // L'identifiant « commande.xxx » (avec un point) rend le document privé.
  const tx = writeClient.transaction().create({
    _id: `commande.${session.id}`,
    _type: "commande",
    createdAt: new Date(
      (session.created ?? Date.now() / 1000) * 1000,
    ).toISOString(),
    status: "payée",
    customerName,
    email,
    phone: session.customer_details?.phone || "",
    address,
    message,
    promoCode: session.metadata?.promoCode || "",
    total: (session.amount_total ?? 0) / 100,
    stripeSessionId: session.id,
    items: lineItems.data.map((li, index) => ({
      _key: `l${index}`,
      name: li.description,
      qty: li.quantity ?? 1,
      ...(items[index]
        ? {
            product: { _type: "reference", _ref: items[index].id, _weak: true },
          }
        : {}),
    })),
  });
  const existing = new Set(
    await writeClient.fetch<string[]>(
      `*[_type == "bijoux" && _id in $ids]._id`,
      {
        ids: items.map((i) => i.id),
      },
    ),
  );
  for (const item of items.filter((i) => existing.has(i.id))) {
    tx.patch(item.id, (p) => p.dec({ stock: item.qty }));
  }

  try {
    await tx.commit();
  } catch (error: any) {
    if (
      error?.statusCode === 409 ||
      /already exists/i.test(String(error?.message))
    ) {
      console.log(`Commande ${session.id} déjà traitée`);
      return;
    }
    throw error;
  }

  const lines = lineItems.data
    .map(
      (li) =>
        `<tr><td style="padding:6px 0;">${escapeHtml(li.description)} × ${li.quantity}</td><td style="padding:6px 0; text-align:right;">${euros(li.amount_total)}</td></tr>`,
    )
    .join("");
  const recap = `<table style="width:100%; border-collapse:collapse; border-top:1px solid #ddd6b4; border-bottom:1px solid #ddd6b4; margin: 16px 0;">${lines}
    <tr><td style="padding:6px 0; color:#8f7a40;">Livraison</td><td style="padding:6px 0; text-align:right;">${euros(session.total_details?.amount_shipping)}</td></tr>
    ${session.total_details?.amount_discount ? `<tr><td style="padding:6px 0; color:#8f7a40;">Réduction</td><td style="padding:6px 0; text-align:right;">−${euros(session.total_details.amount_discount)}</td></tr>` : ""}
    <tr><td style="padding:8px 0; font-weight:bold;">Total</td><td style="padding:8px 0; text-align:right; font-weight:bold;">${euros(session.amount_total)}</td></tr></table>`;

  if (email) {
    await sendMail({
      to: email,
      replyTo: process.env.MY_EMAIL,
      subject: "Dame Pascale — Merci pour votre commande !",
      html: mailLayout(
        `Merci ${escapeHtml(customerName.split(" ")[0])} !`,
        `<p style="line-height:1.6;">Votre commande est bien enregistrée. Je la prépare à la main avec soin et vous préviendrai dès son expédition.</p>
        ${recap}
        ${address ? `<p style="font-size:0.9rem; line-height:1.5;"><strong>Livraison à :</strong><br/>${escapeHtml(address).replace(/\n/g, "<br/>")}</p>` : ""}
        <p style="line-height:1.6;">Une question ? Répondez simplement à cet e-mail.</p>`,
      ),
    });
  }

  await sendMail({
    to: process.env.MY_EMAIL,
    replyTo: email || undefined,
    subject: `Nouvelle commande — ${customerName} (${euros(session.amount_total)})`,
    html: mailLayout(
      "Nouvelle commande 🎉",
      `${mailRows([
        ["Client", customerName],
        ["E-mail", email],
        ["Téléphone", session.customer_details?.phone],
        ["Adresse", address],
        ["Message", message],
        ["Code promo", session.metadata?.promoCode],
      ])}${recap}`,
    ),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await handleCompletedSession(
        event.data.object as Stripe.Checkout.Session,
      );
    } catch (error) {
      console.error("Traitement de commande en échec :", error);
      // 500 : Stripe réessaiera plus tard (sans risque de double décompte).
      return NextResponse.json(
        { error: "Traitement impossible" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
