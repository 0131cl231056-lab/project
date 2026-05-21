import { Router } from "express"
import { register , login , getMe , logout} from "../controllers/auth.controller.js"
import { loginValidation , registerValidation } from "../validator/auth.validator.js"
import {authenticateUser} from "../middlewares/auth.middleware.js"
import multer, { memoryStorage } from "multer"

const upload = multer({storage : memoryStorage()})

const authRouter = Router()

authRouter.post("/register" , upload.single("profilePicture") , registerValidation , register)

authRouter.post("/login" , loginValidation , login)

authRouter.get("/get-me" , authenticateUser , getMe)

authRouter.post("/logout" , authenticateUser , logout)


export default authRouter