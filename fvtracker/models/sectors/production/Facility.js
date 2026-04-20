import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const productionFacilitySchema = new Schema({
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionStock",
      default: [],
    },
  ],
});

productionFacilitySchema.pre("deleteMany", async function () {
  const facilities = await this.model.find(this.getFilter()).distinct("_id");
  await mongoose.model("ProductionStock").deleteMany({
    productionFacility: { $in: facilities },
  });
});

export const ProductionFacility =
  mongoose.models.ProductionFacility ||
  Base.discriminator("ProductionFacility", productionFacilitySchema);
