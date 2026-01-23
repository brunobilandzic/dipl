import mongoose from "mongoose";

const generalManagerSchema = {
  managers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Manager", default: [] },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    default: null, // in seed we create and add it later...
  },
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", new mongoose.Schema(generalManagerSchema));
