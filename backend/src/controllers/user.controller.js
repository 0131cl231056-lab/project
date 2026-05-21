import userModel from "../models/user.model.js";
import {uploadFile } from "../utils/uploadImage.js";

export async function getProfile(req, res) {

    const userId = req.user.id;

    try {

        const user = await userModel.findById(userId);

        if(!user) {

            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "profile fetched successfully",
            user
        });

    } catch(err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function updateProfile(req, res) {

    const userId = req.user.id;

    try {

        const {
            fullname,
            contact,
            bio,
            age,
            gender,
            city,
            state
        } = req.body;

        const updateData = {

            fullname,
            contact,
            bio,
            age,
            gender,
            location: {
                city,
                state
            }
        };

        if(req.file) {

            const uploadedProfilePicture = await uploadFile(
                    req.file.buffer,
                    req.file.originalname
                );

            updateData.profilePicture = uploadedProfilePicture;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId,
            updateData,

                {
                    new: true,
                    runValidators: true
                }
            );

        return res.status(200).json({

            success: true,
            message:"profile updated successfully",
            user: updatedUser
        });

    } catch(err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function updatePreferences(req , res) {

    const userId = req.user.id;

    try {

        const {
            sleepSchedule,
            diet,
            cleanliness,
            smoking,
            drinking,
            pets,
            guestFrequency,
            noiseTolerance,
            studyEnvironment,
            workSchedule,
            sharingPreference,
            preferredGender

        } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(userId,{
                    preferences: {
                        sleepSchedule,
                        diet,
                        cleanliness,
                        smoking,
                        drinking,
                        pets,
                        guestFrequency,
                        noiseTolerance,
                        studyEnvironment,
                        workSchedule,
                        sharingPreference,
                        preferredGender
                    }
                },

                {
                    new: true,
                    runValidators: true
                }
            );

        return res.status(200).json({

            success: true,

            message:
                "preferences updated successfully",

            user: updatedUser
        });

    } catch(err) {

        return res.status(500).json({

            success: false,

            message: err.message
        });
    }
}