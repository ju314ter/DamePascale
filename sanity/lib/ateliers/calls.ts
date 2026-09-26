import { groq } from "next-sanity";
import { sanityFetch } from "../client";
import type { Atelier } from "../types";

export const getAteliers = () => {
  const today = new Date().toISOString().split("T")[0];
  return sanityFetch<Atelier[]>(
    groq`*[_type == "atelier"] | order(orderRank asc, _createdAt asc){
      _id, title, summary, duration, participants, price, priceNote, image, highlights,
      "dates": dates[date >= $today] | order(date asc){ _key, date, places, lieu }
    }`,
    { today },
    [],
  );
};
