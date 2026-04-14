import { Base } from "@/models/Base";
import mongoose from "mongoose";

const productionProcessSchema = {
  harvestingBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestingBatch",
    required: true,
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionMachine",
      default: [],
    },
  ],
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductStock",
  },
  quantity: {
    type: Number,
    default: 0,
  },
};

export const ProductionProcess =
  mongoose.models.ProductionProcess ||
  Base.discriminator(
    "ProductionProcess",
    new mongoose.Schema(productionProcessSchema),
  );
