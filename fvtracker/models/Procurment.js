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

procurmentSchema.pre("save", async function () {
  if (this.isNew) {
    const rootManager = await mongoose.models.RootManager.findById(
      this.manager,
    );
    if (rootManager) {
      rootManager.procurments.push(this._id);
      await rootManager.save();
    }
    for (let item of this.items) {
      const procurmentItem = new ProcurmentItem({
        procurment: this._id,
        ...item,
      });
      this.items.push(procurmentItem._id);
      await procurmentItem.save();
    }
  }
});

export const Procurment =
  mongoose.models.Procurment || mongoose.model("Procurment", procurmentSchema);
export const ProcurmentItem =
  mongoose.models.ProcurmentItem ||
  mongoose.model("ProcurmentItem", procurmentItemSchema);
