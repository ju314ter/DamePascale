import { groq } from "next-sanity";
import { client } from "../client";

export interface BlogPostsFilters {
  category?: string[];
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  publishedDate: string;
  author: string;
  category: {
    _id: string;
    title: string;
  };
  mainImage: any;
  tags: any[];
}

export const getBlogPosts = async (filtres?: BlogPostsFilters) => {
  const categoryPartialQuery = filtres?.category
    ? ` && category._ref in [${filtres.category.map((category) => `"${category}"`)}]`
    : "";
  const query = `*[_type == "blogPost"${categoryPartialQuery}]{
    _id,
    title,
    content,
    category->{
      _id,
      title
    },
    mainImage,
    tags
  }`;
  const blogPosts: BlogPost[] = await client.fetch(groq`${query}`);
  return blogPosts;
};

export const getBlogPostById = async (id: string) => {
  const query = `*[_type == "blogPost" && _id == $id]{
    _id,
    title,
    content,
    category->{
      _id,
      title
    },
    mainImage,
    tags
  }[0]`;
  const blogPost: BlogPost = await client.fetch(groq`${query}`, { id });
  return blogPost;
};

export const getBlogPostsCategories = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const blogCategory = await client.fetch(groq`*[_type == "blogCategory"]`);
  return blogCategory;
};
