import { createReducer, on } from '@ngrx/store';
import { clearLocation, setLocation } from '../actions/location.action';

// Define the initial state as a typed object.
export const initialState = {
  location: '', // or an empty string, depending on your needs
};

export const locationReducer = createReducer(
  initialState,
  on(setLocation, (state, { location }) => ({
    ...state, // Spread the current state
    location // Update the `location` field
  })),
  on(clearLocation, () => initialState)
);