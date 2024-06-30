// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
  },
  content: {
    type: String,
    // required: true,
  },
});

export const Task = mongoose.model("Task", TaskSchema)
