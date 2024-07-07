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
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchem)