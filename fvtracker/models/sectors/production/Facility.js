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
  processes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
});

productionFacilitySchema.pre("deleteMany", async function () {
  const facilities = await this.model.find(this.getFilter()).distinct("_id");
  await mongoose.model("ProductionMachine").deleteMany({
    productionFacility: { $in: facilities },
  });
  await mongoose.model("ProductStock").deleteMany({
    productionFacility: { $in: facilities },
  });
  await mongoose.model("ProductionProcess").deleteMany({
    productionFacility: { $in: facilities },
  });
});

export const ProductionFacility =
  mongoose.models.ProductionFacility ||
  Base.discriminator("ProductionFacility", productionFacilitySchema);
