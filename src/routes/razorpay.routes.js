import Razorpay from 'razorpay';
import { Router } from "express";

const router = Router()
const razorpay = new Razorpay({
  key_id: process.env.R_KEY_ID,
  key_secret: process.env.R_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const options = {
    amount: req.body.amount * 100, 
    currency: 'INR',
    receipt: 'receipt#1',
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
