import mongoose, { Schema } from "mongoose";

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

const procurmentSchema = new Schema({
  manager: {
    type: Schema.Types.ObjectId,
    ref: "rootManager",
    required: true,
  },
  items: [procurmentItemSchema],
  status: {
    type: String,
    enum: ["na čekanju", "odobrena", "odbijena"],
    default: "na čekanju",
  },
});

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
