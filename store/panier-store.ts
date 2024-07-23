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
  addToPanier: (item: ItemType) => void;
  removeFromPanier: (item: ItemType) => void;
};

export const usePanier = create<PanierState>((set) => ({
  panier: [],
  addToPanier: (itemType: ItemType) =>
    set((s: PanierState) => {
      const alreadyHasItem = s.panier.some(
        (item: Item) => item.type._id === itemType._id
      );
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
    }),
  removeFromPanier: (item: ItemType) =>
    set((s: PanierState) => ({
      ...s,
      panier: s.panier.filter(
        (itemCart: Item) => itemCart.type._id !== item._id
      ),
    })),
}));
