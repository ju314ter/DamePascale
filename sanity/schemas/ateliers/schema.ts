import { SchemaTypeDefinition, Rule } from "sanity";

/**
 * Formules d'ateliers affichées sur /ateliers.
 * Sans prix renseigné, la page affiche « Tarif sur demande ».
 * Sans dates, la page propose de demander un créneau.
 */
export const atelierSchema: SchemaTypeDefinition = {
  name: "atelier",
  title: "Atelier (formule)",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nom de la formule",
      type: "string",
      description: "Ex : Atelier découverte — pendentif en fleurs séchées",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "summary",
      title: "Résumé",
      type: "text",
      rows: 3,
      description: "2 à 3 phrases : ce que l'on fabrique, ce que l'on emporte.",
    },
    {
      name: "duration",
      title: "Durée",
      type: "string",
      description: "Ex : 2h30",
    },
    {
      name: "participants",
      title: "Participants",
      type: "string",
      description: "Ex : Individuel · jusqu'à 4 personnes",
    },
    {
      name: "price",
      title: "Prix par personne (€)",
      type: "number",
      validation: (Rule: Rule) => Rule.min(0),
    },
    {
      name: "priceNote",
      title: "Précision sur le prix",
      type: "string",
      description: "Ex : matériel et fleurs inclus",
    },
    {
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "highlights",
      title: "Points forts",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "dates",
      title: "Prochaines dates",
      type: "array",
      of: [
        {
          type: "object",
          name: "sessionAtelier",
          fields: [
            {
              name: "date",
              title: "Date et heure",
              type: "datetime",
              validation: (Rule: Rule) => Rule.required(),
            },
            { name: "places", title: "Places restantes", type: "number" },
            { name: "lieu", title: "Lieu", type: "string" },
          ],
          preview: {
            select: { title: "date", subtitle: "lieu" },
            prepare({
              title,
              subtitle,
            }: {
              title?: string;
              subtitle?: string;
            }) {
              return {
                title: title
                  ? new Date(title).toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })
                  : "Date",
                subtitle,
              };
            },
          },
        },
      ],
    },
    {
      name: "orderRank",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 10,
    },
  ],
};
