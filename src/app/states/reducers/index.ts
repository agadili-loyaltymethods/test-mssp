import {
  ActionReducerMap,
} from '@ngrx/store';
import { cartReducer } from './cart.reducer';
import { locationReducer } from './location.reducer';
import { memberReducer } from './member.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  member: memberReducer,
  cart: cartReducer,
  location: locationReducer
};


