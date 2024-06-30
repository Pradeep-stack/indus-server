// models/Column.js
import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});
export const Column = mongoose.model("Column", ColumnSchema)

