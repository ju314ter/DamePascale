import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { checkCartItem } from "@/app/actions/shop";
import type { AppliedPromo, CartLine, CartProduct } from "@/lib/cart";

type Result = { ok: true } | { ok: false; error: string };

type PanierState = {
  panier: CartLine[];
  promo: AppliedPromo | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
  addToPanier: (
    product: CartProduct,
    opts?: { openCart?: boolean },
  ) => Promise<Result>;
  setQty: (id: string, qty: number) => Promise<Result>;
  removeFromPanier: (id: string) => void;
  clearPanier: () => void;
  setPromo: (promo: AppliedPromo | null) => void;
};

const toCartProduct = (p: CartProduct): CartProduct => ({
  _id: p._id,
  name: p.name,
  highlightedImg: p.highlightedImg,
  price: p.price,
  promotionDiscount: p.promotionDiscount,
});

export const usePanier = create<PanierState>()(
  persist(
    (set, get) => ({
      panier: [],
      promo: null,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),

      addToPanier: async (product, opts = { openCart: true }) => {
        const current =
          get().panier.find((l) => l.product._id === product._id)?.qty ?? 0;
        const check = await checkCartItem(product._id, current + 1);
        if (!check.ok) return { ok: false, error: check.error };
        set((s) => ({
          panier: current
            ? s.panier.map((l) =>
                l.product._id === product._id ? { ...l, qty: l.qty + 1 } : l,
              )
            : [...s.panier, { product: toCartProduct(product), qty: 1 }],
          isOpen: opts.openCart ?? true,
        }));
        return { ok: true };
      },

      setQty: async (id, qty) => {
        if (qty <= 0) {
          get().removeFromPanier(id);
          return { ok: true };
        }
        const current =
          get().panier.find((l) => l.product._id === id)?.qty ?? 0;
        if (qty > current) {
          const check = await checkCartItem(id, qty);
          if (!check.ok) return { ok: false, error: check.error };
        }
        set((s) => ({
          panier: s.panier.map((l) =>
            l.product._id === id ? { ...l, qty } : l,
          ),
        }));
        return { ok: true };
      },

      removeFromPanier: (id) =>
        set((s) => ({ panier: s.panier.filter((l) => l.product._id !== id) })),

      clearPanier: () => set({ panier: [], promo: null }),

      setPromo: (promo) => set({ promo }),
    }),
    {
      name: "dp-panier",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ panier: state.panier, promo: state.promo }),
      // Réhydraté après le premier rendu (voir CartHydrator) pour éviter les écarts SSR.
      skipHydration: true,
    },
  ),
);
