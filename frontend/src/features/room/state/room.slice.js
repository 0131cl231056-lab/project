import { createSlice } from "@reduxjs/toolkit"

const roomSlice = createSlice({
    name: "room",
    initialState: {
        rooms: [],
        room: null,
        myRooms: [],
        loading: false,
        error: null
    },

    reducers: {

        setRooms: (state, action) => {
            state.rooms = action.payload
        },

        setRoom: (state, action) => {
            state.room = action.payload
        },

        setMyRooms: (state, action) => {
            state.myRooms = action.payload
        },

        addRoom: (state, action) => {
            state.myRooms.push(action.payload)
        },

        removeRoom: (state, action) => {
            state.myRooms = state.myRooms.filter(
                room => room._id !== action.payload
            )
        },

        updateMyRoom: (state, action) => {
            const updated = action.payload
            const index = state.myRooms.findIndex(
                room => room._id === updated._id
            )
            if (index !== -1) {
                state.myRooms[index] = updated
            }
        },

        setLoading: (state, action) => {
            state.loading = action.payload
        },

        setError: (state, action) => {
            state.error = action.payload
        }

    }
})

export const {
    setRooms,
    setRoom,
    setMyRooms,
    addRoom,
    removeRoom,
    updateMyRoom,
    setLoading,
    setError
} = roomSlice.actions

export default roomSlice.reducer