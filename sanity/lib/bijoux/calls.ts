import { groq } from "next-sanity";
import { sanityFetch } from "../client";
import type { Bijou, NavLink, Taxonomies } from "../types";
import { isInStock } from "@/lib/stock";

export type { Bijou, Taxonomies } from "../types";

const BIJOU_FIELDS = groq`
  _id,
  _createdAt,
  name,
  price,
  "matieres": matieres[]->{ _id, title },
  "categories": categories[]->{ _id, title },
  "fleurs": fleurs[]->{ _id, title },
  stock,
  highlightedImg,
  imageGallery,
  promotionDiscount
`;

/** Tout le catalogue : les filtres et tris sont appliqués instantanément côté client. */
export const getBijoux = () =>
  sanityFetch<Bijou[]>(
    groq`*[_type == "bijoux"] | order(_createdAt desc){ ${BIJOU_FIELDS} }`,
    {},
    [],
  );

export const getBijouById = (id: string) =>
  sanityFetch<Bijou | null>(
    groq`*[_type == "bijoux" && _id == $id][0]{ ${BIJOU_FIELDS}, description }`,
    { id },
    null,
  );

export const getRelatedBijoux = (id: string, categoryIds: string[]) =>
  sanityFetch<Bijou[]>(
    groq`*[_type == "bijoux" && _id != $id && stock > 0]
      | order(count((categories[]._ref)[@ in $categoryIds]) desc, _createdAt desc)[0...4]{ ${BIJOU_FIELDS} }`,
    { id, categoryIds },
    [],
  );

/**
 * Pièces mises en avant sur l'accueil : uniquement celles en stock. Si la
 * sélection du Studio est vide ou épuisée, on complète avec les dernières
 * pièces disponibles (jusqu'à 6).
 */
export const getCollectionVedette = async (): Promise<Bijou[]> => {
  const [vedette, latest] = await Promise.all([
    sanityFetch<Bijou[] | null>(
      groq`*[_type == "collectionVedette"][0].bijoux[]->{ ${BIJOU_FIELDS} }`,
      {},
      null,
    ),
    sanityFetch<Bijou[]>(
      groq`*[_type == "bijoux" && stock > 0] | order(_createdAt desc)[0...6]{ ${BIJOU_FIELDS} }`,
      {},
      [],
    ),
  ]);
  const selected = (vedette ?? []).filter((b) => b && isInStock(b));
  const ids = new Set(selected.map((b) => b._id));
  return [...selected, ...latest.filter((b) => !ids.has(b._id))].slice(
    0,
    Math.max(6, selected.length),
  );
};

export const getBijouNavlinks = () =>
  sanityFetch<NavLink[]>(
    groq`*[_type == "bijouLienMenu"]{ title, href }`,
    {},
    [],
  );

export const getTaxonomies = () =>
  sanityFetch<Taxonomies>(
    groq`{
      "categories": *[_type == "bijouCategory"] | order(title asc){ _id, title },
      "matieres": *[_type == "bijouMatiere"] | order(title asc){ _id, title },
      "fleurs": *[_type == "bijouFleur"] | order(title asc){ _id, title }
    }`,
    {},
    { categories: [], matieres: [], fleurs: [] },
  );

export const getBijouxSitemap = () =>
  sanityFetch<{ _id: string; _updatedAt: string }[]>(
    groq`*[_type == "bijoux"]{ _id, _updatedAt }`,
    {},
    [],
  );
