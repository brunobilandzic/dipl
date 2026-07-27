import mongoose from "mongoose";

const { Schema } = mongoose;

const cultivationManagerSchema = new Schema( {
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  fields: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      default: null,
    },
  ],
});

export const CultivationManager =
  mongoose.models.CultivationManager ||
  mongoose.model(
    "CultivationManager",
    cultivationManagerSchema,
  );
