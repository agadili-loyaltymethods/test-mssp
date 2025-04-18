import { createAction, props } from "@ngrx/store";

export const addItem = createAction(
  '[Cart] Add Item',
  props<{ item: any }>()
);

export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ itemId: string }>()
);

export const clearCart = createAction('[Cart] Clear Cart');