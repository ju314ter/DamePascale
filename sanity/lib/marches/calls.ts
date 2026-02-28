import { groq } from "next-sanity";
import { client } from "../client";

export interface Marche {
  _id: string;
  city: string;
  lieu: string;
  date: string; // ISO date string "YYYY-MM-DD"
  heures: string;
}

export function formatMarcheDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const formatted = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
  // Capitalize month: "15 mars" → "15 Mars"
  return formatted.replace(/(\d+\s)(\w)/, (_, day, first) => day + first.toUpperCase());
}

export const getMarches = async (): Promise<Marche[]> => {
  const today = new Date().toISOString().split("T")[0];
  const query = groq`*[_type == "marche" && date >= $today] | order(date asc) {
    _id,
    city,
    lieu,
    date,
    heures,
  }`;
  return client.fetch(query, { today });
};
