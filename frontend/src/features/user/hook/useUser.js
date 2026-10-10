import { useDispatch, useSelector } from "react-redux";

import { updatePreferences, getProfile, updateProfile, getRoommates} from "../service/user.api";

import {
    setProfile,
    setProfileCompleted,
    setLoading,
    setError,
    setRoommates,
    setRoommatesLoading,
    setRoommatesError
} from "../state/user.slice";

export function useUser() {

    const dispatch = useDispatch();

    const loading = useSelector(
        (state) => state.user.loading
    );

    const roommates = useSelector(
        (state) => state.user.roommates
    );

    const roommatesLoading = useSelector(
        (state) => state.user.roommatesLoading
    );

    const roommatesError = useSelector(
        (state) => state.user.roommatesError
    );

    async function handleGetProfile() {

        try {

            dispatch(setLoading(true));
            const response = await getProfile();
            dispatch(setProfile(response.user));

            return response;

        } catch(err) {

            dispatch(
                setError(err.response?.data?.message)
            );

            console.log(err);

        } finally {

            dispatch(setLoading(false));
        }
    }

    async function handleUpdatePreferences(data) {

        try {

            dispatch(setLoading(true));

            const response =
                await updatePreferences(data);

            dispatch(
                setProfile(response.user)
            );

            dispatch(
                setProfileCompleted(true)
            );

            return response;

        } catch(err) {

            dispatch(
                setError(err.response?.data?.message)
            );

            console.log(err);

        } finally {

            dispatch(setLoading(false));
        }
    }

    async function handleUpdateProfile(data) {

        try {

            dispatch(setLoading(true));

            const response =
                await updateProfile(data);

            dispatch(
                setProfile(response.user)
            );

            return response;

        } catch(err) {

            dispatch(
                setError(err.response?.data?.message)
            );

            console.log(err);

        } finally {

            dispatch(setLoading(false));
        }
    }

    async function handleGetRoommates(params = {}) {
        try {
            dispatch(setRoommatesLoading(true));
            dispatch(setRoommatesError(null));
            const response = await getRoommates(params);
            dispatch(setRoommates(response.roommates || []));
            return response;
        } catch(err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to load roommates";
            dispatch(setRoommatesError(errorMsg));
            console.log(err);
            throw err;
        } finally {
            dispatch(setRoommatesLoading(false));
        }
    }

    return {

        loading,
        roommates,
        roommatesLoading,
        roommatesError,

        handleGetProfile,

        handleUpdatePreferences,

        handleUpdateProfile,

        handleGetRoommates
    };
}