import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Reject", "Approve"],
    default: "Pending"
  }

});

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
