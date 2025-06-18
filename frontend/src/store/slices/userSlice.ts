import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: string | null;
    email: string;
    isAdmin: boolean;
}

const initialState: UserState = {
    userId: null,
    email: '',
    isAdmin: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            const { userId, email, isAdmin } = action.payload;
            state.userId = userId;
            state.email = email;
            state.isAdmin = isAdmin;
        },
        clearUser(state) {
            state.userId = null;
            state.email = '';
            state.isAdmin = false;
        },
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;