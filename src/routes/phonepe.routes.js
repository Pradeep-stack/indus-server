import express from "express";
import {paymentCallback, initiatePayment} from "../controllers/phonepe.controller.js";

const router = express.Router();

router.get("/callback/:id", paymentCallback);
router.post("/initiate", initiatePayment);

export default router;