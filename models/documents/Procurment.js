import mongoose, { Schema } from "mongoose";
import {
  PROCURMENT_PENDING,
  PROCURMENT_STATUSES,
} from "@/lib/constants/documents/procurments";

const procurmentItemSchema = new Schema({
  name: {
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

const procurmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "RootManager",
      required: true,
    },
    items: [procurmentItemSchema],
    status: {
      type: String,
      enum: PROCURMENT_STATUSES,
      default: PROCURMENT_PENDING,
    },
  },
  { timestamps: true },
);

procurmentSchema.pre("save", async function () {
  if (this.isNew) {
    const rootManager = await mongoose.models.RootManager.findById(
      this.manager,
    );
    if (rootManager) {
      rootManager.procurments.push(this._id);
      await rootManager.save();
    }
  }
});

export const Procurment =
  mongoose.models.Procurment || mongoose.model("Procurment", procurmentSchema);
export const ProcurmentItem =
  mongoose.models.ProcurmentItem ||
  mongoose.model("ProcurmentItem", procurmentItemSchema);
