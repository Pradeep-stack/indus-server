import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String,  },
  email: { type: String,  },
  mobile: { type: String,  },
  address: { type: String,  },
  serviceName: { type: String,  },
  serviceFor: { type: String, enum: ["Self", "Client"], default: "Self" },
  requiredDocuments: { type: String,  },
  comment: { type: String },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Reject", "Approve","Paid", "Failed"],
    default: "Pending",
  },
});

export const Purchase = mongoose.model("Purchase", PurchaseSchema);
