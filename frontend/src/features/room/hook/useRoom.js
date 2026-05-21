import { useDispatch } from "react-redux"

import {
    setRooms,
    setRoom,
    setMyRooms,
    addRoom,
    removeRoom,
    setLoading,
    setError
} from "../state/room.slice"

import {
    createRoom,
    getAllRooms,
    getRoom,
    getMyRooms,
    updateRoom,
    deleteRoom
} from "../service/room.api"

export const useRoom = () => {

    const dispatch = useDispatch()

    async function handleCreateRoom(formData) {

        try {

            dispatch(setLoading(true))

            const data = await createRoom(formData)

            dispatch(addRoom(data.room))

            return data.room

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    async function handleGetAllRooms() {

        try {

            dispatch(setLoading(true))

            const data = await getAllRooms()

            dispatch(setRooms(data.rooms))

            return data.rooms

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    async function handleGetRoom(roomId) {

        try {

            dispatch(setLoading(true))

            const data = await getRoom(roomId)

            dispatch(setRoom(data.room))

            return data.room

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    async function handleGetMyRooms() {

        try {

            dispatch(setLoading(true))

            const data = await getMyRooms()

            dispatch(setMyRooms(data.rooms))

            return data.rooms

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    async function handleUpdateRoom(roomId, formData) {

        try {

            dispatch(setLoading(true))

            const data = await updateRoom(roomId, formData)

            dispatch(setRoom(data.room))

            return data.room

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    async function handleDeleteRoom(roomId) {

        try {

            dispatch(setLoading(true))

            await deleteRoom(roomId)

            dispatch(removeRoom(roomId))

        } catch (err) {

            dispatch(setError(err.response?.data?.message))
            throw err

        } finally {

            dispatch(setLoading(false))

        }
    }

    return {
        handleCreateRoom,
        handleGetAllRooms,
        handleGetRoom,
        handleGetMyRooms,
        handleUpdateRoom,
        handleDeleteRoom
    }
}