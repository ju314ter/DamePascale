import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

import { apiVersion, dataset, projectId, useCdn, viewtoken } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  token: viewtoken,
  //we can ignore warning as the token used is read-only
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source).auto("format").fit("max");
};

export async function verifyStock(items: { id: string; quantity: number }[]) {
  const ids = items.map((item) => item.id);
  const query = `*[_id in $ids]{
    _id,
    name,
    stock
  }`;
  const products = await client.fetch(query, { ids });

  const stockStatus = products.map((product: any) => {
    const orderedItem = items.find((item) => item.id === product._id);
    const isAvailable = product.stock >= (orderedItem?.quantity || 0);
    return {
      id: product._id,
      name: product.name,
      isAvailable,
      requestedQuantity: orderedItem?.quantity || 0,
      availableStock: product.stock,
    };
  });

  const allAvailable = stockStatus.every((item: any) => item.isAvailable);

  return { allAvailable, stockStatus };
}
