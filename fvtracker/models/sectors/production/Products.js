import { Schema } from "mongoose";
import mongoose from "mongoose";

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropVariety",
      default: [],
    },
  ],
});

export const Product = mongoose.models.Product || mongoose.model("Product", productsSchema);  