/**
 * Client Sanity — SERVEUR UNIQUEMENT.
 * Ne jamais importer ce fichier depuis un composant "use client" : il contient
 * un jeton d'accès qui partirait sinon dans le JavaScript envoyé au navigateur.
 * Côté navigateur, utiliser `@/sanity/lib/image` (URLs d'images, sans jeton).
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Permet de pointer vers un faux serveur Sanity en local (tests visuels).
const hostOverride = process.env.SANITY_API_HOST
  ? { apiHost: process.env.SANITY_API_HOST, useProjectHostname: false }
  : {};

const readToken =
  process.env.SANITY_READ_TOKEN ||
  process.env.SANITY_TOKEN ||
  // Jeton public de lecture.
  process.env.NEXT_PUBLIC_SANITY_VIEW_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: readToken,
  ...hostOverride,
});

/** Client avec droits d'écriture (stock, commandes, inscriptions). */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_TOKEN,
  ...hostOverride,
});

export const REVALIDATE_SECONDS = 60;

/**
 * Lecture tolérante aux pannes : une indisponibilité de Sanity ne doit jamais
 * faire tomber une page entière, on affiche alors l'état « vide ».
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  revalidate: number | false = REVALIDATE_SECONDS,
): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate },
    });
    return result ?? fallback;
  } catch (error) {
    console.error("[sanity] requête en échec :", error);
    return fallback;
  }
}
