import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import familyReducer from './slices/familySlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        family: familyReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;