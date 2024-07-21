import mongoose, { Schema } from "mongoose";

const categorySchem = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    region: {
      enum: ["india", "nepal"],
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchem);
