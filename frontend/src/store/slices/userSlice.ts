import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: string | null;
    email: string;
    isAdmin: boolean;
    familyId: string;
}

const initialState: UserState = {
    userId: null,
    email: '',
    isAdmin: false,
    familyId: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            const { userId, email, isAdmin, familyId } = action.payload;
            state.userId = userId;
            state.email = email;
            state.isAdmin = isAdmin;
            state.familyId = familyId;
        },
        clearUser(state) {
            state.userId = null;
            state.email = '';
            state.isAdmin = false;
            state.familyId = '';
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;