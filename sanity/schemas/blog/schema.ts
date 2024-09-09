import { HotspotPreview } from "@/sanity/lib/blog/hotspotpreview";
import { SchemaTypeDefinition } from "sanity";

export const blogCategorySchema: SchemaTypeDefinition = {
  name: "blogCategory",
  title: "Catégorie de Blog",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};

export const blogPostSchema: SchemaTypeDefinition = {
  name: "blogPost",
  title: "Article de Blog",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(100),
    },
    {
      name: "introduction",
      title: "Introduction",
      type: "string",
      validation: (Rule) => Rule.required().min(100).max(750),
    },
    {
      name: "content",
      title: "Contenu",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "author",
      title: "Auteur",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publishedDate",
      title: "Date de Publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "blogCategory" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Image Principale",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "hotspots",
      title: "Hotspots image principale",
      type: "array",
      of: [{ type: "spot" }],
      options: {
        // plugin adds support for this option
        imageHotspot: {
          // see `Image and description path` setup below
          imagePath: `mainImage`,
          descriptionPath: `details`,
          // see `Custom tooltip` setup below
          tooltip: HotspotPreview,
        },
      },
    },
    {
      name: "tags",
      title: "Étiquettes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
  ],
};

export const spotSchema = {
  name: "spot",
  title: "Spot",
  type: "object",
  fieldsets: [{ name: "position", options: { columns: 2 } }],
  fields: [
    { name: "details", type: "text", rows: 2 },
    { name: "url", type: "text", rows: 2 },
    {
      name: "x",
      type: "number",
      readOnly: true,
      fieldset: "position",
      initialValue: 50,
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
    {
      name: "y",
      type: "number",
      readOnly: true,
      fieldset: "position",
      initialValue: 50,
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
  ],
  preview: {
    select: {
      title: "details",
      url: "url",
      x: "x",
      y: "y",
    },
    prepare(selection: Record<string, any>) {
      const { x, y, title, url } = selection;
      return {
        title,
        url,
        subtitle: x && y ? `${x}% x ${y}%` : `No position set`,
      };
    },
  },
};
