export interface AppContextProps {
  cartItems: any[];
  amigurumisCategories: { _id: string; title: string }[];
  bijouxCategories: { _id: string; title: string }[];
  addcartItem: (item: any) => void;
  removeCartItem: (itemId: string) => void;
  setAmigurumisCategories: (
    categories: { _id: string; title: string }[]
  ) => void;
  setBijouxCategories: (categories: { _id: string; title: string }[]) => void;
}

export const initialAppState: AppContextProps = {
  cartItems: [],
  amigurumisCategories: [],
  bijouxCategories: [],
  addcartItem: () => {},
  removeCartItem: () => {},
  setAmigurumisCategories: () => {},
  setBijouxCategories: () => {},
};

export const actions = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  SET_AMIGURUMIS_CATEGORIES: "SET_AMIGURUMIS_CATEGORIES",
  SET_BIJOUX_CATEGORIES: "SET_BIJOUX_CATEGORIES",
};

//Reducer to Handle Actions
export const appReducer = (state: AppContextProps, { payload, type }: any) => {
  switch (type) {
    case actions.ADD_TO_CART:
      return { ...state };
    case actions.REMOVE_FROM_CART: {
      const filteredcartItem = state.cartItems.filter(
        (item) => item.id !== payload
      );
      return { ...state, cartItems: filteredcartItem };
    }
    case actions.SET_AMIGURUMIS_CATEGORIES:
      return { ...state, amigurumisCategories: payload };
    case actions.SET_BIJOUX_CATEGORIES:
      return { ...state, bijouxCategories: payload };
    default:
      return state;
  }
};
