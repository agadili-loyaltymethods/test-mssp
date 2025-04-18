import { createAction, props } from "@ngrx/store";
import { Member } from "../../models/member";

export const addMember = createAction('[MemberInfo] Add', props<{member: Member}>());
export const clearMember = createAction('[MemberInfo] Clear');