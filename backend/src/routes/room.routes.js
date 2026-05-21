import {Router} from "express"
import {authenticateOwner , authenticateUser} from "../middlewares/auth.middleware.js"
import {createRoom , getAllRooms , getRoom , updateRoomDetails , deleteRoom , getMyRooms} from "../controllers/room.controller.js"
import multer, { memoryStorage } from "multer"

const upload = multer({storage : memoryStorage()})

const roomRouter = Router()


roomRouter.post("/create-room" , authenticateUser , authenticateOwner, upload.array("roomImages", 5), createRoom)

roomRouter.get("/all-rooms" , authenticateUser ,    getAllRooms)

roomRouter.get("/room/:roomId" , getRoom)

roomRouter.get("/owner/my-rooms", authenticateUser, authenticateOwner, getMyRooms)

roomRouter.patch("/room/:roomId", authenticateUser, authenticateOwner, upload.array("roomImages", 5), updateRoomDetails)

roomRouter.delete("/room/:roomId" , authenticateUser, authenticateOwner, deleteRoom)


export default roomRouter