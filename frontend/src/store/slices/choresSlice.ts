import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FamilyMember, FamilyState } from "./familySlice";

export interface ChoreWeek {
    family: FamilyState;
    weekStart: Date;
    weekPrize: string;
}

interface Chore {
    choreName: string;
    choreDescription: string;
    choreDeadline: string;
    choreWeek: ChoreWeek;
    choreStaus: "pending" | "in progress" | "done" | "rejected";
    assignees?: FamilyMember[];
}

interface ChoresState {
    chores: Chore[];
}

const initialState: ChoresState = {
    chores: []
}

export const choresSlice = createSlice({
    name: 'chores',
    initialState,
    reducers: {
        addChore(state, action: PayloadAction<Chore>) {
            const chore = action.payload;
            state.chores.push(chore);
        }
    }
});

export const { addChore } = choresSlice.actions;
export default choresSlice.reducer;
