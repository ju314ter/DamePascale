import { SchemaTypeDefinition, Rule } from "sanity";
import { getExtension, getImageDimensions } from "@sanity/asset-utils";

export const amigurumiCategorySchema: SchemaTypeDefinition = {
  name: "amigurumiCategory",
  title: "Amigurumi Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};

export const amigurumiMenuSchema: SchemaTypeDefinition = {
  name: "amigurumiNavlink",
  title: "Lien menu amigurumi",
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

export const amigurumiUniversSchema: SchemaTypeDefinition = {
  name: "amigurumiUnivers",
  title: "Amigurumi Univers",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};

export const amigurumiProductSchema: SchemaTypeDefinition = {
  name: "amigurumis",
  title: "Amigurumis",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: Rule) => Rule.required().min(3).max(100),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: Rule) => Rule.required().min(10).max(1000),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: "highlightedImg",
      title: "Image Highlight",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "imageGallery",
      title: "Image Gallery",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "amigurumiCategory" }],
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: "universes",
      title: "Universes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "amigurumiUnivers" }],
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
    {
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule: Rule) => Rule.required().min(0),
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

export const heroBannerAmigurumiSchema: SchemaTypeDefinition = {
  name: "heroBannerAmigurumi",
  title: "Amigurumi Hero Banner",
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
