import { SchemaTypeDefinition, Rule } from "sanity";

export const marcheSchema: SchemaTypeDefinition = {
  name: "marche",
  title: "Marché / Événement",
  type: "document",
  fields: [
    {
      name: "city",
      title: "Ville",
      type: "string",
      description: "Ex : Paris — Le Marais",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "lieu",
      title: "Lieu / Adresse",
      type: "string",
      description: "Ex : Marché des Créateurs, Rue de Bretagne",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "date",
      title: "Date",
      type: "date",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "heures",
      title: "Horaires",
      type: "string",
      description: "Ex : 10h - 18h",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: "Date (proche → lointaine)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "city",
      subtitle: "date",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle + "T12:00:00").toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
      };
    },
  },
};
