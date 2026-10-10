import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import roomRouter from "./routes/room.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://project-3-z47i.onrender.com"
    ],
    credentials: true
}));

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/room" , roomRouter)

export default app