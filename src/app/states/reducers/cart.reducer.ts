import { createReducer, on } from "@ngrx/store";
import { addItem, clearCart, removeItem } from "../actions/cart.action";
export const initialState: {
  items: any
} = {
  items: [],
};

export const cartReducer = createReducer(
  initialState,
  on(addItem, (state, { item }) => {
    const existingItem = state.items.find((product) => product.sku === item.sku);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((product) =>
          product.sku === item.sku ? { ...product, quantity: item.quantity } : product
        ),
      };
    } else {
      return {
        ...state,
        items: [...state.items, { ...item }],
      };
    }
  }),
  on(removeItem, (state, { itemId }) => ({
    ...state,
    items: state.items.filter((item) => item.sku !== itemId),
  })),
  on(clearCart, () => initialState)
)