type Priced = { price: number; promotionDiscount?: number | null };

export function hasPromo(item: Priced): boolean {
  return !!item.promotionDiscount && item.promotionDiscount > 0;
}

/** Prix unitaire final (promotion produit incluse), arrondi au centime. */
export function finalPrice(item: Priced): number {
  const price = hasPromo(item)
    ? item.price * (1 - (item.promotionDiscount as number) / 100)
    : item.price;
  return Math.round(price * 100) / 100;
}

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number): string {
  return formatter.format(value);
}
