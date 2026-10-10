import axios from "axios";

const userApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/user`,
    withCredentials: true
});

export async function getProfile() {
    const response = await userApi.get("/profile");
    return response.data;
}

export async function updatePreferences(data) {
    const response = await userApi.patch("/preferences", data);
    return response.data;
}

export async function updateProfile(data) {
    const response = await userApi.patch("/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export async function getRoommates(params = {}) {
    const response = await userApi.get("/roommates", { params });
    return response.data;
}

export async function getRoommateById(id) {
    const response = await userApi.get(`/roommate/${id}`);
    return response.data;
}