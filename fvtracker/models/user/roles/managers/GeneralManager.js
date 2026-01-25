import mongoose from "mongoose";

const { Schema } = mongoose;

const generalManagerSchema = new Schema({
  managers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Manager", default: [] },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    default: null,
  },
});

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", generalManagerSchema);
