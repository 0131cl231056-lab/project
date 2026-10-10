import { Router } from "express";
import {authenticateUser} from "../middlewares/auth.middleware.js";
import bcrypt from "bcryptjs";
import multer, { memoryStorage } from "multer"
import {
    getProfile,
    updateProfile,
    updatePreferences,
    createMultipleUsers,
    getRoommates,
    getRoommateById
} from "../controllers/user.controller.js";


const upload = multer({storage : memoryStorage()})

const userRouter = Router();

userRouter.get( "/profile" , authenticateUser , getProfile);

userRouter.patch("/profile" , authenticateUser , upload.single("profilePicture") , updateProfile);

userRouter.patch("/preferences" , authenticateUser , updatePreferences);
userRouter.post("/bulk", createMultipleUsers);
userRouter.get("/roommates", getRoommates);
userRouter.get("/roommate/:id", getRoommateById);

export default userRouter;