"use client";

import { useEffect } from "react";
import { usePanier } from "@/store/panier-store";

/** Vide le panier une fois le paiement confirmé. */
export function ClearCart() {
  useEffect(() => {
    Promise.resolve(usePanier.persist.rehydrate()).then(() =>
      usePanier.getState().clearPanier(),
    );
  }, []);
  return null;
}
