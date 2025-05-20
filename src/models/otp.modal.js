// models/otp.model.js
import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // Auto-delete after 5 minutes
});

export const OTP = mongoose.model("OTP", otpSchema);