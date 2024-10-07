import { groq } from "next-sanity";
import { client } from "../client";

export const getCodePromo = async () => {
  const query = `*[_type == "codePromo"]{
      _id,
      title,
      reductionPercent,
      code
    }`;
  const codePromos: {
    title: string;
    code: string;
    reductionPercent: number;
  }[] = await client.fetch(groq`${query}`);

  return codePromos;
};
