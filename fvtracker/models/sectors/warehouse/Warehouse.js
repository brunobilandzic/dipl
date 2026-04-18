import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const productionFacilitySchema = new Schema({
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionMachine",
      default: [],
    },
  ],
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductStock",
      default: [],
    },
  ],
});

export const ProductionFacility =
  mongoose.models.ProductionFacility ||
  Base.discriminator("ProductionFacility", productionFacilitySchema);
