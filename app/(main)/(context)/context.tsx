// "use client";

// import React, { createContext, useEffect, useReducer } from "react";
// import {
//   AppContextProps,
//   actions,
//   appReducer,
//   initialAppState,
// } from "./reducer";
// import { getAmigurumisCategories } from "@/sanity/lib/amigurumis/calls";
// import { getBijouxCategories } from "@/sanity/lib/bijoux/calls";

// export const AppContext = createContext<AppContextProps>(initialAppState);
// //Context and Provider

// export const Provider = ({ children }: { children: React.ReactNode }) => {
//   const [state, dispatch] = useReducer(appReducer, initialAppState);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const amigurumisCategories = await getAmigurumisCategories();
//       const bijouxCategories = await getBijouxCategories();
//       dispatch({
//         type: actions.SET_AMIGURUMIS_CATEGORIES,
//         payload: amigurumisCategories,
//       });
//       dispatch({
//         type: actions.SET_BIJOUX_CATEGORIES,
//         payload: bijouxCategories,
//       });
//     };
//     fetchCategories();
//   }, []);

//   const value: AppContextProps = {
//     cartItems: state.cartItems,
//     amigurumisCategories: state.amigurumisCategories,
//     bijouxCategories: state.bijouxCategories,
//     addcartItem: (item: any) => {
//       dispatch({ type: actions.ADD_TO_CART, payload: item });
//     },
//     removeCartItem: (itemId: string) => {
//       dispatch({ type: actions.REMOVE_FROM_CART, payload: itemId });
//     },
//     setAmigurumisCategories: (categories: { _id: string; title: string }[]) => {
//       dispatch({
//         type: actions.SET_AMIGURUMIS_CATEGORIES,
//         payload: categories,
//       });
//     },
//     setBijouxCategories: (categories: { _id: string; title: string }[]) => {
//       dispatch({ type: actions.SET_BIJOUX_CATEGORIES, payload: categories });
//     },
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export default Provider;
