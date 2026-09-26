import { finalPrice, formatPrice, hasPromo } from "@/lib/pricing";

export function Price({
  item,
  size = "md",
}: {
  item: { price: number; promotionDiscount?: number };
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: ["text-[0.72rem]", "text-sm"],
    md: ["text-sm", "text-base"],
    lg: ["text-lg", "text-3xl"],
  }[size];
  if (hasPromo(item)) {
    return (
      <span className="inline-flex items-baseline gap-2 font-editorial">
        <span className={`${sizes[1]} text-bronze-600 font-medium`}>
          {formatPrice(finalPrice(item))}
        </span>
        <span
          className={`${sizes[0]} text-olive-400 line-through`}
          aria-label="Prix initial"
        >
          {formatPrice(item.price)}
        </span>
      </span>
    );
  }
  return (
    <span className={`font-editorial ${sizes[1]} text-olive-800`}>
      {formatPrice(item.price)}
    </span>
  );
}
