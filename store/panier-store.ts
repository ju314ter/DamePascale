import { verifyStock } from "@/sanity/lib/client";
import { create } from "zustand";

type ItemType = {
  _id: string;
  name: string;
  highlightedImg: any;
  promotionDiscount?: number;
  price: number;
};

export type Item = {
  type: ItemType & object;
  qty: number;
};

type PanierState = {
  panier: Item[];
  addToPanier: (item: ItemType) => Promise<void>;
  removeFromPanier: (item: ItemType) => void;
};

export const usePanier = create<PanierState>((set, get) => ({
  panier: [],
  addToPanier: async (itemType: ItemType) => {
    console.log("addToPanier");
    const state = get();
    const alreadyHasItem = state.panier.some(
      (item: Item) => item.type._id === itemType._id
    );

    const currentQuantity = alreadyHasItem
      ? state.panier.find((item: Item) => item.type._id === itemType._id)
          ?.qty || 0
      : 0;

    const hasStock = await verifyStock([
      { id: itemType._id, quantity: currentQuantity + 1 },
    ]);

    console.log("hasStock ?", hasStock);

    if (!hasStock.allAvailable) {
      throw new Error("No stock available for this item");
    }

    set((s: PanierState) => {
      const newState = {
        ...s,
        panier: !alreadyHasItem
          ? [...s.panier, { type: itemType, qty: 1 }]
          : [
              ...s.panier.map((item: Item) => {
                if (item.type._id === itemType._id) item.qty += 1;
                return item;
              }),
            ],
      };
      return newState;
    });
  },
  removeFromPanier: (item: ItemType) =>
    set((s: PanierState) => ({
      ...s,
      panier: s.panier.filter(
        (itemCart: Item) => itemCart.type._id !== item._id
      ),
    })),
}));
