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
  ],
};
