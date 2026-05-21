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

export const routes = createBrowserRouter([
    {
        element : <MainLayout />,
        children : [
            {
                path: "/",
                element: <h1>Hello</h1>
            },
            {
                path: "/create-room",
                element: <CreateRoom />
            },
            {
                path: "/rooms",
                element: <AllRooms />
            },
            {
                path: "/room/:roomId",
                element: <RoomDetails />
            },
            {
                path: "/owner/my-rooms",
                element: <MyRooms />
            },
            {
                path: "/edit-room/:roomId",
                element: <EditRoom />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/preferences",
                element: <Preferences />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/editProfile",
                element: <EditProfile />
            }
        ]
    }
])