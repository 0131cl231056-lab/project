import userModel from "../models/user.model.js";
import { uploadFile } from "../utils/uploadImage.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { calculateRoommateCompatibility } from "../utils/calculateCompatibility.js";

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
export const createMultipleUsers = async (req, res) => {
    try {
        const users = req.body;

        const hashedUsers = await Promise.all(
            users.map(async (user) => {
                return {
                    ...user,
                    password: await bcrypt.hash(user.password, 10)
                };
            })
        );

        const createdUsers = await userModel.insertMany(hashedUsers);

        res.status(201).json({
            success: true,
            message: `${createdUsers.length} users created successfully`,
            users: createdUsers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export async function getRoommates(req, res) {
    try {
        let currentUserId = null;
        const token = req.cookies?.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, config.JWT_SECRET);
                currentUserId = decoded.id;
            } catch (err) {
                // Ignore token error for optional auth
            }
        }

        const currentUser = currentUserId ? await userModel.findById(currentUserId) : null;

        const {
            search,
            city,
            gender,
            minAge,
            maxAge,
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
            sort = "bestMatch"
        } = req.query;

        const filter = { role: "user" };

        if (currentUserId) {
            filter._id = { $ne: currentUserId };
        }

        if (city && city.trim()) {
            filter["location.city"] = { $regex: new RegExp(city.trim(), "i") };
        }

        if (gender && gender !== "any" && gender !== "all") {
            filter.gender = gender.toLowerCase();
        }

        if (minAge || maxAge) {
            filter.age = {};
            if (minAge) filter.age.$gte = Number(minAge);
            if (maxAge) filter.age.$lte = Number(maxAge);
        }

        if (sleepSchedule && sleepSchedule !== "any") {
            filter["preferences.sleepSchedule"] = sleepSchedule;
        }

        if (diet && diet !== "any") {
            filter["preferences.diet"] = diet;
        }

        if (cleanliness && cleanliness !== "any") {
            filter["preferences.cleanliness"] = cleanliness;
        }

        if (smoking !== undefined && smoking !== "" && smoking !== "any") {
            filter["preferences.smoking"] = smoking === "true" || smoking === true;
        }

        if (drinking !== undefined && drinking !== "" && drinking !== "any") {
            filter["preferences.drinking"] = drinking === "true" || drinking === true;
        }

        if (pets !== undefined && pets !== "" && pets !== "any") {
            filter["preferences.pets"] = pets === "true" || pets === true;
        }

        if (guestFrequency && guestFrequency !== "any") {
            filter["preferences.guestFrequency"] = guestFrequency;
        }

        if (noiseTolerance && noiseTolerance !== "any") {
            filter["preferences.noiseTolerance"] = noiseTolerance;
        }

        if (studyEnvironment && studyEnvironment !== "any") {
            filter["preferences.studyEnvironment"] = studyEnvironment;
        }

        if (workSchedule && workSchedule !== "any") {
            filter["preferences.workSchedule"] = workSchedule;
        }

        if (sharingPreference && sharingPreference !== "any") {
            filter["preferences.sharingPreference"] = sharingPreference;
        }

        if (search && search.trim()) {
            const searchRegex = { $regex: new RegExp(search.trim(), "i") };
            filter.$or = [
                { fullname: searchRegex },
                { "location.city": searchRegex },
                { "location.state": searchRegex },
                { bio: searchRegex }
            ];
        }

        const users = await userModel.find(filter).select("-password").lean();

        let roommates = users.map((u) => {
            let compatibility = null;
            let compatibilityBreakdown = [];

            if (currentUser) {
                const result = calculateRoommateCompatibility(currentUser, u);
                compatibility = result.score;
                compatibilityBreakdown = result.breakdown;
            }

            return {
                ...u,
                compatibility,
                compatibilityBreakdown
            };
        });

        // Sorting
        if (sort === "bestMatch" || sort === "compatibility") {
            roommates.sort((a, b) => {
                const compA = a.compatibility !== null ? a.compatibility : -1;
                const compB = b.compatibility !== null ? b.compatibility : -1;
                if (compB !== compA) {
                    return compB - compA;
                }
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
        } else if (sort === "ageAsc") {
            roommates.sort((a, b) => (a.age || 0) - (b.age || 0));
        } else if (sort === "ageDesc") {
            roommates.sort((a, b) => (b.age || 0) - (a.age || 0));
        } else if (sort === "recent") {
            roommates.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return res.status(200).json({
            success: true,
            count: roommates.length,
            roommates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getRoommateById(req, res) {
    try {
        const { id } = req.params;
        const roommate = await userModel.findOne({ _id: id, role: "user" }).select("-password").lean();

        if (!roommate) {
            return res.status(404).json({
                success: false,
                message: "Roommate not found"
            });
        }

        let currentUserId = null;
        const token = req.cookies?.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, config.JWT_SECRET);
                currentUserId = decoded.id;
            } catch (err) {
                // Ignore token error
            }
        }

        let compatibility = null;
        let compatibilityBreakdown = [];
        if (currentUserId && currentUserId !== String(roommate._id)) {
            const currentUser = await userModel.findById(currentUserId);
            if (currentUser) {
                const result = calculateRoommateCompatibility(currentUser, roommate);
                compatibility = result.score;
                compatibilityBreakdown = result.breakdown;
            }
        }

        return res.status(200).json({
            success: true,
            roommate: {
                ...roommate,
                compatibility,
                compatibilityBreakdown
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

