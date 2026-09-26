import { groq } from "next-sanity";
import { sanityFetch } from "../client";
import type { Marche } from "../types";

export type { Marche } from "../types";
export { formatMarcheDate } from "@/lib/dates";

export const getMarches = () => {
  const today = new Date().toISOString().split("T")[0];
  return sanityFetch<Marche[]>(
    groq`*[_type == "marche" && date >= $today] | order(date asc){
      _id, city, lieu, date, heures
    }`,
    { today },
    [],
  );
};
