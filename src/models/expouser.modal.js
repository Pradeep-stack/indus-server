import mongoose, { Schema } from "mongoose";

const expoUserSchema = new Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      // required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ExpoUser = mongoose.model("ExpoUser", expoUserSchema);
