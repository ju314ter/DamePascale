import { groq } from "next-sanity";
import { client } from "../client";

export interface AmigurumiFilters {
  price?: [number, number];
  universes?: string[];
  categories?: string[];
}

export interface ContentChild {
  _type: string;
  marks: string[];
  text: string;
  _key: string;
}

export interface ContentBlock {
  _type: string;
  style: string;
  _key: string;
  markDefs: any[];
  children: ContentChild[];
  level?: number;
  listItem?: string;
}

export interface Amigurumi {
  _id: string;
  name: string;
  description?: ContentBlock[];
  price: number;
  universes: {
    _id: string;
    title: string;
  }[];
  categories: {
    _id: string;
    title: string;
  }[];
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
  const pricePartialQuery = filtres?.price
    ? ` && price >= ${filtres.price[0]} && price <= ${filtres.price[1]}`
    : "";

  const universPartialQuery =
    filtres?.universes && filtres.universes.length > 0
      ? ` && (${filtres.universes.map((univers) => `"${univers}" in universes[]->_id`).join(" || ")})`
      : "";

  const categoryPartialQuery =
    filtres?.categories && filtres.categories.length > 0
      ? ` && (${filtres.categories.map((cat) => `"${cat}" in categories[]->_id`).join(" || ")})`
      : "";

  const query = `*[_type == "amigurumis"${universPartialQuery}${categoryPartialQuery}${pricePartialQuery}]{
    _id,
    name,
    price,
    "universes": universes[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
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
    "universes": universes[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
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
    price,
    "universes": universes[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
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
