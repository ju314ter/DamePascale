import { getExtension, getImageDimensions } from "@sanity/asset-utils";
import { SchemaTypeDefinition, Rule } from "sanity";

export const bijouCategorySchema: SchemaTypeDefinition = {
  name: "bijouCategory",
  title: "Bijou Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nom de la catégorie",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};
export const bijouFleurSchema: SchemaTypeDefinition = {
  name: "bijouFleur",
  title: "Bijou Fleur",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Fleur utilisée",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};
export const bijouMenuSchema: SchemaTypeDefinition = {
  name: "bijouNavlink",
  title: "Lien menu bijou",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "href",
      title: "Destination (boutique-amigurumi?....)",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};
export const bijouMatiereSchema: SchemaTypeDefinition = {
  name: "bijouMatiere",
  title: "Bijou Matiere",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Matière utilisée",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};

export const bijouProductSchema: SchemaTypeDefinition = {
  name: "bijoux",
  title: "Bijoux",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nom du produit",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(100),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(1000),
    },
    {
      name: "price",
      title: "Prix",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "highlightedImg",
      title: "Image Highlight",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "imageGallery",
      title: "Galerie d'images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "categories",
      title: "Catégories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "bijouCategory" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "fleurs",
      title: "Fleurs",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "bijouFleur" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "matieres",
      title: "Matières",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "bijouMatiere" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: "promotionDiscount",
      title: "Promotion Discount",
      type: "number",
      description: "Optional promotion discount percentage",
      validation: (Rule: Rule) => Rule.min(0).max(100),
    },
  ],
};

export const heroBannerBijouSchema: SchemaTypeDefinition = {
  name: "heroBannerBijou",
  title: "Bijoux Hero Banner",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Sous-titre",
      type: "string",
    },
    {
      name: "heroImg",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) =>
        Rule.required().custom((image: any) => {
          if (!image) {
            return true;
          }

          const filetype = getExtension(image.asset._ref);

          if (filetype !== "jpg" && filetype !== "png") {
            return "Image must be a JPG or PNG";
          }

          const { width, height } = getImageDimensions(image.asset._ref);

          if (width < 1200 || height < 500) {
            return "Image must be at least 1200x500 pixels";
          }

          return true;
        }),
    },
    {
      name: "buttonText",
      title: "Texte du bouton",
      type: "string",
    },
    {
      name: "buttonLink",
      title: "Lien du bouton",
      type: "url",
    },
  ],
};
