import { groq } from "next-sanity";
import { client } from "../client";
import { ContentBlock } from "../amigurumis/calls";

export interface BijouFilters {
  price?: [number, number];
  matieres?: string[];
  fleurs?: string[];
  categories?: string[];
}

export interface Bijou {
  _id: string;
  name: string;
  description: ContentBlock[];
  price: number;
  matieres: {
    _id: string;
    title: string;
  }[];
  categories: {
    _id: string;
    title: string;
  }[];
  fleurs: {
    _id: string;
    title: string;
  }[];
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
  const pricePartialQuery = filtres?.price
    ? ` && price >= ${filtres.price[0]} && price <= ${filtres.price[1]}`
    : "";
  const matierePartialQuery =
    filtres?.matieres && filtres.matieres.length > 0
      ? ` && (${filtres.matieres.map((matiere) => `"${matiere}" in matieres[]->_id`).join(" || ")})`
      : "";
  const fleurPartialQuery =
    filtres?.fleurs && filtres.fleurs.length > 0
      ? ` && (${filtres.fleurs.map((fleur) => `"${fleur}" in fleurs[]->_id`).join(" || ")})`
      : "";

  const categoryPartialQuery =
    filtres?.categories && filtres.categories.length > 0
      ? ` && (${filtres.categories.map((cat) => `"${cat}" in categories[]->_id`).join(" || ")})`
      : "";

  const query = `*[_type == "bijoux"${pricePartialQuery}${matierePartialQuery}${fleurPartialQuery}${categoryPartialQuery}]{
    _id,
    name,
    price,
    "matieres": matieres[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
      _id,
      title,
    },
    "fleurs": fleurs[]-> {
      _id,
      title,
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
    "matieres": matieres[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
      _id,
      title,
    },
    "fleurs": fleurs[]-> {
      _id,
      title,
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
    price,
    "matieres": matieres[]-> {
      _id,
      title,
    },
    "categories": categories[]-> {
      _id,
      title,
    },
    "fleurs": fleurs[]-> {
      _id,
      title,
    },
    stock,
    highlightedImg,
    imageGallery,
    promotionDiscount
  }`;
  const bijoux: Bijou[] = await client.fetch(groq`${query}`);
  return bijoux;
};

export const getCollectionVedette = async (): Promise<Bijou[]> => {
  const query = groq`*[_type == "collectionVedette"][0]{
    "bijoux": bijoux[]-> {
      _id,
      name,
      price,
      highlightedImg,
      stock,
      promotionDiscount
    }
  }.bijoux`;

  const bijoux: Bijou[] | null = await client.fetch(query);

  if (!bijoux || bijoux.length === 0) {
    return getLastNBijoux(6);
  }
  return bijoux;
};

export const getBijouNavlinks = async () => {
  const query = `*[_type == "bijouLienMenu"]{
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
