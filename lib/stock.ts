/**
 * Une pièce est en boutique seulement si son stock est un nombre > 0.
 * Un stock vide, absent ou à 0 la range dans « Trop tard ! » (jamais « nulle part »).
 */
export const isInStock = (item: { stock?: number | string | null }) =>
  Number(item.stock) > 0;
