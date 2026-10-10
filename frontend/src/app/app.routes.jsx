import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Preferences from "../features/user/pages/Preferences";
import Profile from "../features/user/pages/Profile";
import EditProfile from "../features/user/pages/EditProfile";
import MainLayout from "../layout/MainLayout";
import CreateRoom from "../features/room/pages/CreateRoom";
import AllRooms from "../features/room/pages/AllRooms";
import RoomDetails from "../features/room/pages/RoomDetails";
import MyRooms from "../features/room/pages/MyRooms";
import EditRoom from "../features/room/pages/EditRoom";
import Home from "../features/home/pages/Home";
import FindRoommates from "../features/roommate/pages/FindRoommates";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = createBrowserRouter([
    {
        element : <MainLayout />,
        children : [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/find-roommates",
                element: <FindRoommates />
            },
            {
                path: "/rooms",
                element: <AllRooms />
            },
            {
                path: "/room/:roomId",
                element: <RoomDetails />
            },
            // Owner-only protected routes
            {
                path: "/create-room",
                element: (
                    <ProtectedRoute allowedRoles={["owner"]}>
                        <CreateRoom />
                    </ProtectedRoute>
                )
            },
            {
                path: "/owner/my-rooms",
                element: (
                    <ProtectedRoute allowedRoles={["owner"]}>
                        <MyRooms />
                    </ProtectedRoute>
                )
            },
            {
                path: "/owner/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["owner"]}>
                        <MyRooms />
                    </ProtectedRoute>
                )
            },
            {
                path: "/edit-room/:roomId",
                element: (
                    <ProtectedRoute allowedRoles={["owner"]}>
                        <EditRoom />
                    </ProtectedRoute>
                )
            },
            // Public auth routes
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            // Authenticated user routes
            {
                path: "/preferences",
                element: (
                    <ProtectedRoute>
                        <Preferences />
                    </ProtectedRoute>
                )
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                )
            },
            {
                path: "/editProfile",
                element: (
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                )
            }
        ]
    }
])