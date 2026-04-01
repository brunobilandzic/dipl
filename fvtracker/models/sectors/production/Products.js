import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { isNumber } from "lodash";

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [ingredientsSchema],
});

productsSchema.pre("save", async function () {
  if (this.isModified("ingredients") && this.ingredients.length > 0) {
    for (const ingredient of this.ingredients) {
      const cropVariety = cropVarieties.find(
        (cv) => cv.name === ingredient.cropVariety,
      );
      if (!cropVariety) {
        throw new Error(`Crop variety "${ingredient.cropVariety}" not found.`);
      }
      ingredient.cropVariety = cropVariety._id;
      cropVariety.products.push(this._id);
      await cropVariety.save();
    }
  }
});

const ingredientsSchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productsSchema);
