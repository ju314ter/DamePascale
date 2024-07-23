import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source).auto("format").fit("max");
};
