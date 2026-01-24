import mongoose from "mongoose";

const cultivationManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  fields: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      default: null,
    },
  ],
};
export const CultivationManager =
  mongoose.models.CultivationManager ||
  mongoose.model(
    "CultivationManager",
    new mongoose.Schema(cultivationManagerSchema),
  );
