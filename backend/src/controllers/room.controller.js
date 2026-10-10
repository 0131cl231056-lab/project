import roomModel from "../models/room.model.js";
import {uploadFile} from "../utils/uploadImage.js"
import { calculateCompatibility } from "../utils/calculateCompatibility.js";
import userModel from "../models/user.model.js"

export async function createRoom(req , res){
    try {

        const {
            title,
            description,
            rent,
            city,
            state,
            address,
            amenities,
            available,
            roomType,
            preferredTenant
        } = req.body;

        const roomImages = [];

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Room images are required"
            });
        }

        for (const file of req.files) {

            const uploadedImage = await uploadFile(
                file.buffer,
                file.originalname,
            );

            roomImages.push(uploadedImage);
        }

        const room = await roomModel.create({
            owner: req.user._id,
            title,
            description,
            rent,
            city,
            state,
            address,
            roomImages,
            amenities,
            available,
            roomType,
            preferredTenant
        });

        return res.status(201).json({
            message: "Room created successfully",
            room
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
}

export const createMultipleRooms = async (req, res) => {
    try {
        const rooms = await roomModel.insertMany(req.body);

        res.status(201).json({
            success: true,
            message: `${rooms.length} rooms created successfully`,
            rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export async function getAllRooms(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const userPreferences = user.preferences || {};

        const rooms = await roomModel.find();

        const roomsWithCompatibility = rooms.map(room => {
            const compatibility = calculateCompatibility(
                userPreferences,
                room.preferredTenant
            );

            return {
                ...room.toObject(),
                compatibility
            };
        });

        roomsWithCompatibility.sort(
            (a, b) => b.compatibility - a.compatibility
        );

        return res.status(200).json({
            success: true,
            rooms: roomsWithCompatibility
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export async function getRoom(req, res) {
  try {
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId).populate("owner", "fullname email profilePicture");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
        message : "room fetched successfully",
        success : true,
        room,
    });

  } catch (error) {
        return res.status(500).json({
        message: error.message,
        });
    }
}

export async function getMyRooms(req, res) {
    try {

        const rooms = await roomModel.find({
            owner: req.user._id
        });

        return res.status(200).json({
            success: true,
            rooms
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
}

export async function updateRoomDetails(req, res) {
  try {

    const { roomId } = req.params;

    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      rent,
      city,
      state,
      address,
      amenities,
      available,
      roomType,
      preferredTenant,
    } = req.body || {};

    let uploadedImages = room.roomImages;

    if (req.files && req.files.length > 0) {

      uploadedImages = [];

      for (const file of req.files) {

        const imageUrl = await uploadFile(
          file.buffer,
          file.originalname,
        );

        uploadedImages.push(imageUrl);
      }
    }

    room.title = title || room.title;
    room.description = description || room.description;
    room.rent = rent || room.rent;
    room.city = city || room.city;
    room.state = state || room.state;
    room.address = address || room.address;
    room.amenities = amenities || room.amenities;
    room.available =
      available !== undefined ? available : room.available;
    room.roomType = roomType || room.roomType;
    room.preferredTenant =
      preferredTenant || room.preferredTenant;

    room.roomImages = uploadedImages;

    await room.save();

    return res.status(200).json({
      message: "Room updated successfully",
      room,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
}

export async function deleteRoom(req, res) {
  try {

    const { roomId } = req.params;

    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await room.deleteOne();

    return res.status(200).json({
      message: "Room deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
}