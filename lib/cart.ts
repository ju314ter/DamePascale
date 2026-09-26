import { finalPrice } from "./pricing";
import { SHIPPING } from "./site";

export type CartProduct = {
  _id: string;
  name: string;
  highlightedImg: any;
  price: number;
  promotionDiscount?: number;
};

export type CartLine = { product: CartProduct; qty: number };

export type AppliedPromo = {
  code: string;
  type: "absolute" | "percent";
  value: number;
  label: string;
};

export function cartTotals(lines: CartLine[], promo?: AppliedPromo | null) {
  const subtotal = lines.reduce(
    (acc, l) => acc + finalPrice(l.product) * l.qty,
    0,
  );
  const shipping =
    lines.length === 0 || subtotal >= SHIPPING.freeThreshold
      ? 0
      : SHIPPING.cost;
  let discount = 0;
  if (promo) {
    discount =
      promo.type === "absolute"
        ? Math.min(promo.value, subtotal)
        : (subtotal * Math.min(promo.value, 100)) / 100;
  }
  discount = Math.round(discount * 100) / 100;
  const total = Math.max(
    0,
    Math.round((subtotal - discount + shipping) * 100) / 100,
  );
  const missingForFreeShipping = Math.max(0, SHIPPING.freeThreshold - subtotal);
  const count = lines.reduce((acc, l) => acc + l.qty, 0);
  return { subtotal, shipping, discount, total, missingForFreeShipping, count };
}
