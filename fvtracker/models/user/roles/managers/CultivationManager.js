import mongoose from "mongoose";

const { Schema } = mongoose;

const cultivationManagerSchema = new Schema( {
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
});

export const CultivationManager =
  mongoose.models.CultivationManager ||
  mongoose.model(
    "CultivationManager",
    cultivationManagerSchema,
  );
