import { groq } from "next-sanity";
import { sanityFetch } from "../client";

export type CodePromo = {
  title: string;
  code: string;
  reductionPercent: number;
  type: "absolute" | "percent";
};

/** SERVEUR UNIQUEMENT — les codes ne doivent jamais être envoyés au navigateur. */
export const getCodePromo = () =>
  sanityFetch<CodePromo[]>(
    groq`*[_type == "codePromo"]{ title, code, reductionPercent, type }`,
    {},
    [],
    false,
  );

export const getBoutiqueStatus = async () => {
  const config = await sanityFetch<{ boutiqueStatus?: string } | null>(
    groq`*[_type == "uniqueConfigBoutique"][0]{ boutiqueStatus }`,
    {},
    null,
    30,
  );
  return config?.boutiqueStatus ?? "open";
};

export const isBoutiqueOpen = async () => {
  const status = await getBoutiqueStatus();
  return status !== "closed" && status !== "maintenance";
};
