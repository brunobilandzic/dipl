import { Schema } from "mongoose";

const procurmentSchema = new Schema({
  manager: {
    type: Schema.Types.ObjectId,
    ref: "rootManager",
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProcurmentItem",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["na čekanju", "odobrena", "odbijena"],
    default: "na čekanju",
  },
});

const procurmentItemSchema = new Schema({
  procurment: {
    type: Schema.Types.ObjectId,
    ref: "Procurment",
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Procurment =
  mongoose.models.Procurment || mongoose.model("Procurment", procurmentSchema);
export const ProcurmentItem =
  mongoose.models.ProcurmentItem ||
  mongoose.model("ProcurmentItem", procurmentItemSchema);
