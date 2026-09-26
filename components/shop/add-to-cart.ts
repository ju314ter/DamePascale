"use client";

import { usePanier } from "@/store/panier-store";
import { toast } from "@/components/ui/use-toast";
import type { CartProduct } from "@/lib/cart";

/** Ajoute au panier (le tiroir s'ouvre) ou affiche l'erreur de stock. */
export async function addProductToCart(product: CartProduct) {
  const result = await usePanier.getState().addToPanier(product);
  if (!result.ok) {
    toast({ variant: "destructive", title: result.error });
  }
  return result.ok;
}
