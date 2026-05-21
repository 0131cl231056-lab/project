import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    rent : {
        type : Number,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    roomImages : [
        {
            type : String,
            required : true
        }
    ],
    amenities: [
        {
            type: String,
        },
    ],

    available: {
        type: Boolean,
        default: true,
    },

    roomType: {
        type: String,
        enum: ["Single", "Double", "Shared"],
        required: true,
    },
    preferredTenant: {
      smoking: {
        type: String,
        enum: ["Yes", "No", "Doesn't Matter"],
      },

      drinking: {
        type: String,
        enum: ["Yes", "No", "Doesn't Matter"],
      },

      diet: {
        type: String,
        enum: ["Vegetarian", "Non Vegetarian", "Vegan", "Doesn't Matter"],
      },

      sleepSchedule: {
        type: String,
      },

      cleanliness: {
        type: String,
      },

      gender: {
        type: String,
        enum: ["Male", "Female", "Any"],
      },
    },
  },
  { timestamps: true }
);

const roomModel = mongoose.model("rooms" , roomSchema)

export default roomModel