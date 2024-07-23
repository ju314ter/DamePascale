import { groq } from "next-sanity";
import { client } from "../client";

export interface AmigurumiFilters {
  size?: ("S" | "M" | "L")[];
  price?: [number, number];
  univers?: string[];
  category?: string[];
}

export interface Amigurumi {
  _id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  univers: {
    _id: string;
    title: string;
  };
  category: {
    _id: string;
    title: string;
  };
  stock: number;
  highlightedImg: any;
  imageGallery: any[];
  promotionDiscount?: number;
}

export interface AmigurumiHerobanner {
  _id: string;
  title: string;
  subtitle: string;
  heroImg: any;
  buttonText: string;
  buttonLink: string;
}

export const getAmigurumis = async (filtres?: AmigurumiFilters) => {
  const sizePartialQuery = filtres?.size
    ? ` && size in [${filtres.size.map((size) => `"${size}"`)}]`
    : "";
  const pricePartialQuery = filtres?.price
    ? ` && price >= ${filtres.price[0]} && price <= ${filtres.price[1]}`
    : "";
  const universPartialQuery = filtres?.univers
    ? ` && univers._ref in [${filtres.univers.map((univers) => `"${univers}"`)}]`
    : "";
  const categoryPartialQuery = filtres?.category
    ? ` && category._ref in [${filtres.category.map((category) => `"${category}"`)}]`
    : "";
  const query = `*[_type == "amigurumis"${sizePartialQuery}${pricePartialQuery}${universPartialQuery}${categoryPartialQuery}]{
    _id,
    name,
    description,
    price,
    size,
    univers->{
      _id,
      title
    },
    category->{
      _id,
      title
    },
    stock,
    highlightedImg,
    imageGallery,
    promotionDiscount
  }`;
  const amigurumis: Amigurumi[] = await client.fetch(groq`${query}`);
  return amigurumis;
};

export const getAmigurumiNavlinks = async () => {
  const query = `*[_type == "amigurumiNavlink"]{
    _id,
    title,
    href
  }`;
  const navlinks: { title: string; href: string }[] = await client.fetch(
    groq`${query}`
  );
  return navlinks;
};

export const getAmigurumiById = async (id: string) => {
  const query = `*[_type == "amigurumis" && _id == $id]{
    _id,
    name,
    description,
    price,
    size,
    univers->{
      _id,
      title
    },
    category->{
      _id,
      title
    },
    stock,
    highlightedImg,
    imageGallery,
    promotionDiscount
  }[0]`;
  const amigurumi: Amigurumi = await client.fetch(groq`${query}`, { id });
  return amigurumi;
};

export const getLastNAmigurumis = async (n: number) => {
  const query = `*[_type == "amigurumis"] | order(_createdAt desc) [0...${n}]{
    _id,
    name,
    description,
    price,
    size,
    univers->{
      _id,
      title
    },
    category->{
      _id,
      title
    },
    stock,
    highlightedImg,
    imageGallery,
    promotionDiscount
  }`;
  const amigurumis: Amigurumi[] = await client.fetch(groq`${query}`);
  return amigurumis;
};

export const getAmigurumisCategories = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const amigurumisCat = await client.fetch(
    groq`*[_type == "amigurumiCategory"]`
  );
  return amigurumisCat;
};

export const getAmigurumisUnivers = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const amigurumisCat = await client.fetch(
    groq`*[_type == "amigurumiUnivers"]`
  );
  return amigurumisCat;
};

export const getAmigurumisHeroBanner = async () => {
  const amigurumisHeroItems: AmigurumiHerobanner[] = await client.fetch(
    groq`*[_type == "heroBannerAmigurumi"]`
  );
  return amigurumisHeroItems;
};
