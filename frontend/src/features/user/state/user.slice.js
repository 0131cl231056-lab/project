import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    profileCompleted: false,
    loading: false,
    error: null,
    roommates: [],
    roommatesLoading: false,
    roommatesError: null
};

const userSlice = createSlice({

    name: "user",

    initialState,

    reducers: {

        setProfile: (state, action) => {
            state.profile = action.payload;
        },

        setProfileCompleted:(state, action) => {
            state.profileCompleted = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setRoommates: (state, action) => {
            state.roommates = action.payload;
        },

        setRoommatesLoading: (state, action) => {
            state.roommatesLoading = action.payload;
        },

        setRoommatesError: (state, action) => {
            state.roommatesError = action.payload;
        },

        clearUser: (state) => {
            state.profile = null;
            state.profileCompleted = false;
            state.loading = false;
            state.error = null;
            state.roommates = [];
            state.roommatesLoading = false;
            state.roommatesError = null;
        }
    }
});

export const {
    setProfile,
    setProfileCompleted,
    setLoading,
    setError,
    setRoommates,
    setRoommatesLoading,
    setRoommatesError,
    clearUser
} = userSlice.actions;

export default userSlice.reducer;