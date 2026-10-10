import dotenv from "dotenv";
import mongoose from "mongoose";
import roomModel from "./src/models/room.model.js";
import userModel from "./src/models/user.model.js";

dotenv.config();

const rooms = [
  {
    title: "Peaceful Single Room in Bhopal",
    description:
      "Clean and peaceful room suitable for students and working professionals.",
    rent: 8000,
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "MP Nagar, Bhopal",
    roomImages: [
      "https://ik.imagekit.io/flgbjchio/userimage.jpeg"
    ],
    amenities: [
      "WiFi",
      "Attached Bathroom",
      "Study Table",
      "Parking"
    ],
    available: true,
    roomType: "Single",
    preferredTenant: {
      smoking: "No",
      drinking: "No",
      diet: "Vegetarian",
      sleepSchedule: "earlyBird",
      cleanliness: "high",
      gender: "Any"
    }
  },

  {
    title: "Modern Shared Room Near University",
    description:
      "Affordable shared room with a friendly environment and essential amenities.",
    rent: 6000,
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Kolar Road, Bhopal",
    roomImages: [
      "https://ik.imagekit.io/flgbjchio/userimage.jpeg"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Table"
    ],
    available: true,
    roomType: "Shared",
    preferredTenant: {
      smoking: "No",
      drinking: "Doesn't Matter",
      diet: "Doesn't Matter",
      sleepSchedule: "earlyBird",
      cleanliness: "high",
      gender: "Any"
    }
  },

  {
    title: "Social Room for Working Professionals",
    description:
      "A social and lively shared accommodation for working professionals.",
    rent: 7000,
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Arera Colony, Bhopal",
    roomImages: [
      "https://ik.imagekit.io/flgbjchio/userimage.jpeg"
    ],
    amenities: [
      "WiFi",
      "TV",
      "Kitchen",
      "Parking"
    ],
    available: true,
    roomType: "Double",
    preferredTenant: {
      smoking: "Yes",
      drinking: "Yes",
      diet: "Non Vegetarian",
      sleepSchedule: "nightOwl",
      cleanliness: "low",
      gender: "Any"
    }
  },

  {
    title: "Girls PG Near Main Market",
    description:
      "Safe and comfortable accommodation for female students and professionals.",
    rent: 7500,
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Shahpura, Bhopal",
    roomImages: [
      "https://ik.imagekit.io/flgbjchio/userimage.jpeg"
    ],
    amenities: [
      "WiFi",
      "Security",
      "Laundry",
      "CCTV"
    ],
    available: true,
    roomType: "Single",
    preferredTenant: {
      smoking: "No",
      drinking: "No",
      diet: "Vegetarian",
      sleepSchedule: "nightOwl",
      cleanliness: "high",
      gender: "Female"
    }
  }
];

async function seedRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const owner = await userModel.findOne({
      email: "rohan@example.com"
    });

    if (!owner) {
      throw new Error("Owner not found");
    }

    await roomModel.deleteMany({
      owner: owner._id
    });

    const roomsWithOwner = rooms.map(room => ({
      ...room,
      owner: owner._id
    }));

    await roomModel.create(roomsWithOwner);

    console.log(`${rooms.length} rooms created successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedRooms();