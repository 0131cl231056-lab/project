import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "./src/models/user.model.js";

dotenv.config();

const users = [
  {
    fullname: "Rahul Sharma",
    email: "rahul@example.com",
    password: "Rahul@123",
    contact: "9876543210",
    bio: "Software developer who enjoys a peaceful and clean living environment.",
    age: 23,
    gender: "male",
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh"
    },
    role: "user",
    preferences: {
      sleepSchedule: "earlyBird",
      diet: "vegetarian",
      cleanliness: "high",
      smoking: false,
      drinking: false,
      pets: false,
      guestFrequency: "rarely",
      noiseTolerance: "low",
      studyEnvironment: "quiet",
      workSchedule: "office",
      sharingPreference: "shareRoom",
      preferredGender: "any"
    }
  },

  {
    fullname: "Priya Verma",
    email: "priya@example.com",
    password: "Priya@123",
    contact: "9876543211",
    bio: "Student looking for a friendly and organized roommate.",
    age: 22,
    gender: "female",
    location: {
      city: "Indore",
      state: "Madhya Pradesh"
    },
    role: "user",
    preferences: {
      sleepSchedule: "nightOwl",
      diet: "vegetarian",
      cleanliness: "high",
      smoking: false,
      drinking: false,
      pets: false,
      guestFrequency: "sometimes",
      noiseTolerance: "medium",
      studyEnvironment: "quiet",
      workSchedule: "student",
      sharingPreference: "shareRoom",
      preferredGender: "female"
    }
  },

  {
    fullname: "Arjun Mehta",
    email: "arjun@example.com",
    password: "Arjun@123",
    contact: "9876543212",
    bio: "Working professional who prefers a relaxed and social environment.",
    age: 25,
    gender: "male",
    location: {
      city: "Pune",
      state: "Maharashtra"
    },
    role: "user",
    preferences: {
      sleepSchedule: "nightOwl",
      diet: "non-vegetarian",
      cleanliness: "medium",
      smoking: true,
      drinking: true,
      pets: false,
      guestFrequency: "often",
      noiseTolerance: "high",
      studyEnvironment: "social",
      workSchedule: "hybrid",
      sharingPreference: "shareRoom",
      preferredGender: "male"
    }
  },

  {
    fullname: "Sneha Patel",
    email: "sneha@example.com",
    password: "Sneha@123",
    contact: "9876543213",
    bio: "Calm and organized professional who values cleanliness.",
    age: 24,
    gender: "female",
    location: {
      city: "Ahmedabad",
      state: "Gujarat"
    },
    role: "user",
    preferences: {
      sleepSchedule: "earlyBird",
      diet: "vegan",
      cleanliness: "high",
      smoking: false,
      drinking: false,
      pets: true,
      guestFrequency: "rarely",
      noiseTolerance: "low",
      studyEnvironment: "quiet",
      workSchedule: "workFromHome",
      sharingPreference: "privateRoom",
      preferredGender: "female"
    }
  },

  {
    fullname: "Aman Singh",
    email: "aman@example.com",
    password: "Aman@123",
    contact: "9876543214",
    bio: "Software engineer looking for a comfortable place near work.",
    age: 26,
    gender: "male",
    location: {
      city: "Bangalore",
      state: "Karnataka"
    },
    role: "user",
    preferences: {
      sleepSchedule: "earlyBird",
      diet: "non-vegetarian",
      cleanliness: "medium",
      smoking: false,
      drinking: false,
      pets: false,
      guestFrequency: "sometimes",
      noiseTolerance: "medium",
      studyEnvironment: "moderate",
      workSchedule: "office",
      sharingPreference: "shareRoom",
      preferredGender: "male"
    }
  },

  {
    fullname: "Kavya Nair",
    email: "kavya@example.com",
    password: "Kavya@123",
    contact: "9876543215",
    bio: "Design student who enjoys a quiet and creative environment.",
    age: 21,
    gender: "female",
    location: {
      city: "Bangalore",
      state: "Karnataka"
    },
    role: "user",
    preferences: {
      sleepSchedule: "nightOwl",
      diet: "vegetarian",
      cleanliness: "medium",
      smoking: false,
      drinking: false,
      pets: true,
      guestFrequency: "sometimes",
      noiseTolerance: "medium",
      studyEnvironment: "quiet",
      workSchedule: "student",
      sharingPreference: "shareRoom",
      preferredGender: "female"
    }
  },

  {
    fullname: "Rohan Kapoor",
    email: "rohan@example.com",
    password: "Rohan@123",
    contact: "9876543216",
    bio: "Property owner offering comfortable rooms for students and professionals.",
    age: 32,
    gender: "male",
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh"
    },
    role: "owner",
    preferences: {
      sleepSchedule: "earlyBird",
      diet: "vegetarian",
      cleanliness: "high",
      smoking: false,
      drinking: false,
      pets: false,
      guestFrequency: "rarely",
      noiseTolerance: "low",
      studyEnvironment: "quiet",
      workSchedule: "office",
      sharingPreference: "privateRoom",
      preferredGender: "any"
    }
  },

  {
    fullname: "Ananya Joshi",
    email: "ananya@example.com",
    password: "Ananya@123",
    contact: "9876543217",
    bio: "Room owner providing affordable rooms in a convenient location.",
    age: 30,
    gender: "female",
    location: {
      city: "Indore",
      state: "Madhya Pradesh"
    },
    role: "owner",
    preferences: {
      sleepSchedule: "earlyBird",
      diet: "vegetarian",
      cleanliness: "high",
      smoking: false,
      drinking: false,
      pets: false,
      guestFrequency: "rarely",
      noiseTolerance: "medium",
      studyEnvironment: "quiet",
      workSchedule: "office",
      sharingPreference: "privateRoom",
      preferredGender: "any"
    }
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    await userModel.deleteMany({
      email: { $in: users.map(user => user.email) }
    });

    await userModel.create(users);

    console.log(`${users.length} users created successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error.message);
    process.exit(1);
  }
}

seedUsers();