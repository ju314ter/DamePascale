import { SchemaTypeDefinition } from "sanity";

export const codePromoSchema: SchemaTypeDefinition = {
  name: "codePromo",
  title: "Codes Promotionnels",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "code",
      title: "Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "reductionPercent",
      title: "Pourcentage de réduction",
      type: "number",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "type",
      title: "Type reduc",
      type: "string",
      options: {
        list: [
          { title: "Absolute", value: "absolute" },
          { title: "Percentage", value: "percent" },
        ],
        layout: "radio", // This makes it a radio button
      },
      validation: (Rule) => Rule.required(),
    },
  ],
};
