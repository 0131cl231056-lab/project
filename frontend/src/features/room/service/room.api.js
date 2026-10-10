import axios from "axios";

const roomApi = axios.create({
    baseURL: "http://localhost:3000/api/room",
    withCredentials: true
})

export async function createRoom(formData) {

    const response = await roomApi.post(
        "/create-room",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    return response.data
}

export async function getAllRooms() {

    const response = await roomApi.get("/all-rooms")

    return response.data
}

export async function getRoom(roomId) {

    const response = await roomApi.get(`/room/${roomId}`)

    return response.data
}

export async function getMyRooms() {

    const response = await roomApi.get("/owner/my-rooms")

    return response.data
}

export async function updateRoom(roomId, formData) {

    const response = await roomApi.patch(
        `/room/${roomId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    return response.data
}

export async function deleteRoom(roomId) {

    const response = await roomApi.delete(
        `/room/${roomId}`
    )

    return response.data
}

export async function toggleRoomAvailability(roomId, available) {

    const formData = new FormData()
    formData.append("available", available)

    const response = await roomApi.patch(
        `/room/${roomId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )

    return response.data
}