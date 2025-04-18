import { createAction, props } from "@ngrx/store";

export const setLocation = createAction(
  '[Location] Add',
  props<{ location: any }>()
);

export const clearLocation = createAction('[Location] Clear Location');