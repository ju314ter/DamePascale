import { SchemaTypeDefinition } from "sanity";

// export const mySingleton = {
//   name: "mySingleton",
//   title: "My Singleton",
//   type: "document",
//   options: {
//     singleton: true, // Identify this document as a singleton
//   },
// };

export const configBoutiqueSchema: SchemaTypeDefinition = {
  name: "uniqueConfigBoutique",
  title: "Configuration boutique",
  type: "document",
  fields: [
    {
      name: "boutiqueStatus",
      title: "Status de la boutique",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Closed", value: "closed" },
          { title: "Under Maintenance", value: "maintenance" },
        ],
        layout: "dropdown", // This makes it a dropdown
        initialValue: "open",
        validation: (Rule: any) => Rule.required(),
      },
    },
  ],
  // options: {
  //   singleton: true, // Identify this document as a singleton
  // },
};

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
