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
    type:Boolean,
    default: false,
  }

});

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
