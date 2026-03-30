import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";

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

productsSchema.pre("save", async function () {
  if (this.isModified("cropVarieties") && this.cropVarieties.length > 0) {
    console.log(this._doc);
    const cropVarieties = await CropVariety.find({
      _id: { $in: this.cropVarieties },
    });
    for (const cropVariety of cropVarieties) {
      cropVariety.products.push(this._id);
      await cropVariety.save();
    }
  }
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productsSchema);
