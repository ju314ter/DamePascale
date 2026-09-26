import { SchemaTypeDefinition } from "sanity";

/** Commandes payées, créées automatiquement par le webhook Stripe. */
export const commandeSchema: SchemaTypeDefinition = {
  name: "commande",
  title: "Commandes",
  type: "document",
  readOnly: true,
  fields: [
    { name: "createdAt", title: "Date", type: "datetime" },
    { name: "status", title: "Statut", type: "string" },
    { name: "customerName", title: "Client", type: "string" },
    { name: "email", title: "E-mail", type: "string" },
    { name: "phone", title: "Téléphone", type: "string" },
    { name: "address", title: "Adresse de livraison", type: "text" },
    { name: "message", title: "Message du client", type: "text" },
    { name: "promoCode", title: "Code promo", type: "string" },
    { name: "total", title: "Total payé (€)", type: "number" },
    {
      name: "items",
      title: "Articles",
      type: "array",
      of: [
        {
          type: "object",
          name: "ligneCommande",
          fields: [
            { name: "name", title: "Article", type: "string" },
            { name: "qty", title: "Quantité", type: "number" },
            {
              name: "product",
              title: "Produit",
              type: "reference",
              to: [{ type: "bijoux" }],
              weak: true,
            },
          ],
        },
      ],
    },
    { name: "stripeSessionId", title: "Session Stripe", type: "string" },
  ],
  orderings: [
    {
      title: "Plus récentes",
      name: "createdDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "customerName", total: "total", date: "createdAt" },
    prepare({
      title,
      total,
      date,
    }: {
      title?: string;
      total?: number;
      date?: string;
    }) {
      return {
        title: `${title ?? "Client"} — ${total?.toFixed(2) ?? "?"} €`,
        subtitle: date ? new Date(date).toLocaleString("fr-FR") : "",
      };
    },
  },
};

/** Inscriptions « Me prévenir des prochains marchés et ateliers ». */
export const inscriptionSchema: SchemaTypeDefinition = {
  name: "inscription",
  title: "Inscriptions (actus)",
  type: "document",
  readOnly: true,
  fields: [
    { name: "email", title: "E-mail", type: "string" },
    { name: "createdAt", title: "Date", type: "datetime" },
    { name: "source", title: "Page d'inscription", type: "string" },
  ],
};
