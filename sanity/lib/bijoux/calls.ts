import { groq } from "next-sanity";
import { client } from "../client";

export interface BijouFilters {
  size?: ("S" | "M" | "L")[];
  price?: [number, number];
  matiere?: string[];
  fleur?: string[];
  category?: string[];
}

export interface Bijou {
  _id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  matiere: {
    _id: string;
    title: string;
  };
  category: {
    _id: string;
    title: string;
  };
  fleur: {
    _id: string;
    title: string;
  };
  stock: number;
  highlightedImg: any;
  imageGallery: any[];
  promotionDiscount?: number;
}

export interface BijouHerobanner {
  _id: string;
  title: string;
  subtitle: string;
  heroImg: any;
  buttonText: string;
  buttonLink: string;
}

export const getBijoux = async (filtres?: BijouFilters) => {
  const sizePartialQuery = filtres?.size
    ? ` && size in [${filtres.size.map((size) => `"${size}"`)}]`
    : "";
  const pricePartialQuery = filtres?.price
    ? ` && price >= ${filtres.price[0]} && price <= ${filtres.price[1]}`
    : "";
  const matierePartialQuery = filtres?.matiere
    ? ` && matiere._ref in [${filtres.matiere.map((matiere) => `"${matiere}"`)}]`
    : "";
  const fleurPartialQuery = filtres?.fleur
    ? ` && fleur._ref in [${filtres.fleur.map((fleur) => `"${fleur}"`)}]`
    : "";
  const categoryPartialQuery = filtres?.category
    ? ` && category._ref in [${filtres.category.map((category) => `"${category}"`)}]`
    : "";
  const query = `*[_type == "bijoux"${sizePartialQuery}${pricePartialQuery}${matierePartialQuery}${fleurPartialQuery}${categoryPartialQuery}]{
    _id,
    name,
    description,
    price,
    size,
    matiere->{
      _id,
      title
    },
    category->{
      _id,
      title
    },
    fleur->{
      _id,
      title
    },
    stock,
    highlightedImg,
    imageGallery,
    promotionDiscount
  }`;
  const bijoux: Bijou[] = await client.fetch(groq`${query}`);
  return bijoux;
};

export const getBijouById = async (id: string) => {
  const query = `*[_type == "bijoux" && _id == $id]{
    _id,
    name,
    description,
    price,
    size,
    matiere->{
      _id,
      title
    },
    fleur->{
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
  const bijou: Bijou = await client.fetch(groq`${query}`, { id });
  return bijou;
};

export const getLastNBijoux = async (n: number) => {
  const query = `*[_type == "bijoux"] | order(_createdAt desc) [0...${n}]{
    _id,
    name,
    description,
    price,
    size,
    matiere->{
      _id,
      title
    },
    fleur->{
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
  const bijoux: Bijou[] = await client.fetch(groq`${query}`);
  return bijoux;
};

export const getBijouNavlinks = async () => {
  const query = `*[_type == "bijouNavlink"]{
    _id,
    title,
    href
  }`;
  const navlinks: { title: string; href: string }[] = await client.fetch(
    groq`${query}`
  );
  return navlinks;
};

export const getBijouxCategories = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const bijouxCat = await client.fetch(groq`*[_type == "bijouCategory"]`);
  return bijouxCat;
};

export const getBijouxMatieres = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const bijouxMatiere = await client.fetch(groq`*[_type == "bijouMatiere"]`);
  return bijouxMatiere;
};

export const getBijouxFleurs = async (): Promise<
  {
    _id: string;
    title: string;
  }[]
> => {
  const bijouxFleurs = await client.fetch(groq`*[_type == "bijouFleur"]`);
  return bijouxFleurs;
};

export const getBijouxHeroBanner = async () => {
  const bijouxHeroItems: BijouHerobanner[] = await client.fetch(
    groq`*[_type == "heroBannerBijou"]`
  );
  return bijouxHeroItems;
};
