import { Base } from "@/models/Base";

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
    ref: "Product",
    required: true,
  },
};

export const ProductionProcess =
  mongoose.models.ProductionProcess ||
  Base.discriminator(
    "ProductionProcess",
    new mongoose.Schema(productionProcessSchema),
  );
