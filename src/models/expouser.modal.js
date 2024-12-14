import mongoose, { Schema } from "mongoose";

const expoUserSchema = new Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
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
  },
  {
    timestamps: true,
  }
);

export const ExpoUser = mongoose.model("ExpoUser", expoUserSchema);
