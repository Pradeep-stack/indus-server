import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
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

export const Video = mongoose.model("Video", videoSchema)