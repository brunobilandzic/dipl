import { Base } from "@/models/Base";
import mongoose from "mongoose";

const productionProcessSchema = {
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionMachine",
      default: [],
    },
  ],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  productStock: {
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
