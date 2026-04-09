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
