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
      // required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      // required: true,
    },
    userType: {
      type: String,
      enum: [
        "agent",
        "buyer",
        "exhibitor",
        "member",
        "staff",
        "admin",
        "superadmin",
        "owner"
      ],
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    stall_number: {
      type: Number,
    },
    stall_size: {
      type: Number,
    },
    isWatched: {
      type: Boolean,
      default: false,
    },
    badge_image_url: { type: String },
  },
  {
    timestamps: true,
  }
);

const websiteSchema = new Schema(
  {
    websiteUrl: {
      type: String,
      required: true,
      default: "https://surat-dreams.vercel.app/find-stall",
    },
    activateLink: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ExpoWebsite = mongoose.model("ExpoWebsite", websiteSchema);
export const ExpoUser = mongoose.model("ExpoUser", expoUserSchema);
