import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import {uploadFile} from "../utils/uploadImage.js"

async function createToken(res , user , message){
    const token = jwt.sign({
        id : user._id
        },config.JWT_SECRET,
        {expiresIn : "7d"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    })

    res.status(201).json({
        message,
        success : true,
        user : {
            id : user._id,
            fullname : user.fullname, 
            email : user.email, 
            contact : user.contact, 
            bio : user.bio, 
            age : user.age, 
            gender : user.gender, 
            location : user.location, 
            profilePicture : user.profilePicture, 
            role : user.role, 
            preferences : user.preferences
        }
    })
}

export async function register(req , res){
    const{
        fullname,
        email,
        password,
        contact,
        bio,
        age,
        gender,
        city,
        state,
        role,
        preferences
    } = req.body

    const location = {
        city,
        state
    }

    try{

        const isUserAlreadyExists = await userModel.findOne({email})

        if(isUserAlreadyExists){
            return res.status(400).json({
                message : "user with this email already exists",
                success : false
            })
        }

        let uploadedProfilePicture = ""

        if(req.file){

           uploadedProfilePicture = await uploadFile(
                    req.file.buffer,
                    req.file.originalname
                )
        }

        const user = await userModel.create({
            fullname , 
            email , 
            password , 
            contact , 
            bio , 
            age , 
            gender , 
            location , 
            profilePicture : uploadedProfilePicture, 
            role , 
            preferences
        })

        return await createToken(res , user , "user registered successfully")

    }catch(err){

    console.log(err)

    return res.status(500).json({
        message : err.message,
        success : false
    })
}
}

export async function login(req , res){
    const {email , password} = req.body

    try{
        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false
            })
        }

        const isPasswordMatched = await user.comparePassword(password)

        if(!isPasswordMatched){
            return res.status(401).json({
                message : "Invalid credentials",
                success : false
            })
        }

        return await createToken(res , user , "user loggedIn successfully")
    }catch(err){
        return res.status(500).json({
            message : "something went wrong",
            success : false
        })
    }
}

export async function getMe(req , res){
    const userId = req.user.id

    try{
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false
            })
        }

        res.status(200).json({
            message : "user details fetched successfully",
            success : true,
            user : {
                id : user._id,
                fullname : user.fullname, 
                email : user.email, 
                contact : user.contact, 
                bio : user.bio, 
                age : user.age, 
                gender : user.gender, 
                location : user.location, 
                profilePicture : user.profilePicture, 
                role : user.role, 
                preferences : user.preferences
            }
        })
    }catch(err){
        return res.status(500).json({
            message : "something went wrong",
            success : false
        })
    }
}

export async function logout(req , res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    })

    res.status(200).json({
        message : "user loggedout successfully",
        success : true
    })
}