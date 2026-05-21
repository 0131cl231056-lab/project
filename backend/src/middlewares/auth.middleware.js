import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import userModel from "../models/user.model.js"

export async function authenticateUser(req , res , next){
    const token = req.cookies.token

    if(!token){
            return res.status(401).json({
                message : "Token not found , unauthorised access",
                success : false
            })
    }
    try{
        const decoded = jwt.verify(token , config.JWT_SECRET)

        req.user = decoded

        next()

    }catch(err){
        return res.status(403).json({
            message : "forbidden content",
            success : false
        })
    }
}

export const authenticateOwner = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "owner") {
            return res.status(403).json({
                message: "Access denied. Owners only."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
