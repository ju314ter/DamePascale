import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { Stripe } from "stripe";

import { apiVersion, dataset, projectId, useCdn, viewtoken } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  token: viewtoken,
});

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  token: process.env.SANITY_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source).auto("format").fit("max");
};

export async function updateSanityStock(lineItems: Stripe.LineItem[]) {
  for (const item of lineItems) {
    const productName = item.description;
    const quantitySold = item.quantity || 0;

    // Recherchez le produit dans Sanity
    const query = `*[_type == "product" && name == $productName][0]`;
    const product = await client.fetch(query, { productName });

    if (product) {
      // Mettez à jour le stock
      const updatedStock = Math.max(0, product.stock - quantitySold);
      await client.patch(product._id).set({ stock: updatedStock }).commit();

      console.log(`Stock mis à jour pour ${productName}: ${updatedStock}`);
    } else {
      console.log(`Produit non trouvé: ${productName}`);
    }
  }
}

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
