import { Schema } from "mongoose";
import mongoose from "mongoose";

const productionFacilitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionMachine",
    },
  ],
  processes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productionFacilitySchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const ProductionFacility = mongoose.model(
  "ProductionFacility",
  productionFacilitySchema,
);
