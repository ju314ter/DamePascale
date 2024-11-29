import { groq } from "next-sanity";
import { client } from "../client";

export const getCodePromo = async () => {
  const query = `*[_type == "codePromo"]{
      _id,
      title,
      reductionPercent,
      code,
      type
    }`;
  const codePromos: {
    title: string;
    code: string;
    reductionPercent: number;
    type: "absolute" | "percent";
  }[] = await client.fetch(groq`${query}`);

  return codePromos;
};

export const getBoutiqueStatus = async () => {
  const query = `*[_type == "uniqueConfigBoutique"][0]{
      _id,
      boutiqueStatus
    }`;
  const config: {
    boutiqueStatus: string;
  } = await client.fetch(groq`${query}`);
  return config.boutiqueStatus;
};
