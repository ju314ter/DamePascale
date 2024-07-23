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
      name: "content",
      title: "Contenu",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(5000),
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
