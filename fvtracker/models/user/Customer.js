import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    dafault: null,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: [],
    },
  ],
});

export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
