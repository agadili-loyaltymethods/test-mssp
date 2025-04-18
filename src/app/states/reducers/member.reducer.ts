import { createReducer, on } from "@ngrx/store";
import { addMember, clearMember } from "../actions/member.action";

export const initialState = {};

export const memberReducer = createReducer(
    initialState,
    on(addMember, (state, {member}) => (
        {...member}
    )),
    on(clearMember, () => initialState)
)