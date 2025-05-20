// routes/email.js
import { Router } from "express";
import sendOtpEmail from "../utils/sendMail.js";

const router = Router();
router.post("/send-otp-email", async (req, res) => {
  const { email, otp } = req.body;

  const result = await sendOtpEmail(email, otp);
  if (result.success) {
    res
      .status(200)
      .json({ message: "OTP email sent successfully", data: result.data });
  } else {
    res
      .status(500)
      .json({ message: "Failed to send OTP email", error: result.error });
  }
});

export default router;
