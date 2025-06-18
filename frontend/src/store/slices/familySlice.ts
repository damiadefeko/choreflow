import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FamilyMember {
    email: string;
    score: number;
}

interface FamilyState {
    familyId: string | null;
    members: FamilyMember[];
    inviteId: string;
}

const initialState: FamilyState = {
    familyId: null,
    members: [],
    inviteId: '',
};

export const familySlice = createSlice({
    name: 'family',
    initialState,
    reducers: {
        setFamily(state, action: PayloadAction<FamilyState>) {
            const { familyId, members, inviteId } = action.payload;
            state.familyId = familyId;
            state.members = members;
            state.inviteId = inviteId;
        },
        clearFamily(state) {
            state.familyId = null;
            state.members = [];
            state.inviteId = '';
        },
    },
});
export const { setFamily, clearFamily } = familySlice.actions;
export default familySlice.reducer;