import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FamilyMember, FamilyState } from "./familySlice";

export interface ChoreWeek {
    id: string;
    family: FamilyState;
    weekStart: Date;
    weekPrize: string;
}

export interface Chore {
    id: string;
    choreName: string;
    choreDescription: string;
    choreDeadline: string;
    choreWeek: ChoreWeek;
    chorePoints: number;
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
        addChore(state, action: PayloadAction<Partial<Chore>>) {
            const chore = action.payload;
            const isDuplicate = state.chores.some(curChore => curChore.id === chore.id);

            if (!isDuplicate) {
                // @ts-ignore
                state.chores.push(chore);
            }
        },
        updateChore(state, action: PayloadAction<Chore>) {
            const payloadChore = action.payload;
            const choreIndex = state.chores.findIndex(curChore => curChore.id === payloadChore.id);

            state.chores[choreIndex] = payloadChore;
        },
        setChoreWeekPrize(state, action: PayloadAction<Partial<ChoreWeek>>) {
            const { weekPrize } = action.payload;
            state.chores.forEach(chore => chore.choreWeek.weekPrize = weekPrize as string);
        }
    }
});

export const { addChore, updateChore, setChoreWeekPrize } = choresSlice.actions;
export default choresSlice.reducer;
