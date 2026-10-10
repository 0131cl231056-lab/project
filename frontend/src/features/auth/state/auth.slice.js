import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : null,
        loading : false,
        error : null,
        isInitialized : false
    },
    reducers : {
        setProfile : (state , action) => {
            state.user = action.payload
        },
        setLoading : (state , action) => {
            state.loading = action.payload
        },
        setError : (state , action) => {
            state.error = action.payload
        },
        setInitialized : (state , action) => {
            state.isInitialized = action.payload
        },
    }
})

export const {setProfile , setLoading , setError , setInitialized} = authSlice.actions
export default authSlice.reducer