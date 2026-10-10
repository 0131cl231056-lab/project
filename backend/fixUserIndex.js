import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function fixIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const collection = mongoose.connection.collection("users");

        await collection.dropIndex("username_1");

        console.log("username_1 index removed successfully");

        await mongoose.disconnect();

    } catch (error) {
        console.error("Error:", error.message);
    }
}

fixIndex();