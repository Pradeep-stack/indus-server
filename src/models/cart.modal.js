import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, default: 0 }, // Optional, can be calculated dynamically
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);