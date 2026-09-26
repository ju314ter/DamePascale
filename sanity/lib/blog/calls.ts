import { groq } from "next-sanity";
import { sanityFetch } from "../client";
import type { BlogPost } from "../types";

export type { BlogPost } from "../types";

export const getBlogPosts = () =>
  sanityFetch<BlogPost[]>(
    groq`*[_type == "blogPost"] | order(publishedDate desc){
      _id, title, introduction, publishedDate,
      category->{ _id, title },
      mainImage, tags
    }`,
    {},
    [],
  );

export const getBlogPostById = (id: string) =>
  sanityFetch<BlogPost | null>(
    groq`*[_type == "blogPost" && _id == $id][0]{
      _id, title, introduction, content, publishedDate, author,
      category->{ _id, title },
      mainImage, hotspots, tags
    }`,
    { id },
    null,
  );

export const getBlogSitemap = () =>
  sanityFetch<{ _id: string; _updatedAt: string }[]>(
    groq`*[_type == "blogPost"]{ _id, _updatedAt }`,
    {},
    [],
  );
