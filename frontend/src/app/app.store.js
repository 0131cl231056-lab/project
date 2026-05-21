import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice"
import userReducer from "../features/user/state/user.slice"
import roomReducer from "../features/room/state/room.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user : userReducer,
        room : roomReducer
    }
})