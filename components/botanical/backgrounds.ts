import type { CSSProperties } from "react";

/** Fonds « papier » partagés. */
export const warmVintage: CSSProperties = {
  backgroundColor: "#fefefe",
  backgroundImage: `
    radial-gradient(ellipse at 30% 70%, rgba(226,146,59,0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(157,186,154,0.06) 0%, transparent 50%),
    repeating-conic-gradient(rgba(139,119,75,0.012) 0% 25%, transparent 0% 50%) 0 0 / 3px 3px,
    linear-gradient(170deg, #fefefe 0%, #fdfcfa 30%, #f7f4ef 70%, #fefefe 100%)
  `,
};

export const paperBg: CSSProperties = {
  backgroundColor: "#fefefe",
  backgroundImage: `linear-gradient(135deg, #fefefe 0%, #fdfcfa 40%, #f7f4ef 100%)`,
};

export const sageWash: CSSProperties = {
  backgroundColor: "#f5f9f2",
  backgroundImage: `
    radial-gradient(ellipse at 10% 65%, rgba(157,186,154,0.14) 0%, transparent 55%),
    radial-gradient(ellipse at 88% 15%, rgba(139,119,75,0.07) 0%, transparent 50%),
    linear-gradient(158deg, #f5f9f2 0%, #eef3e8 30%, #f0ebe0 65%, #f4f8f1 100%)
  `,
};

export const ruledPaper: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(139,119,75,0.08) 31px, rgba(139,119,75,0.08) 32px)`,
  backgroundSize: "100% 32px",
};
