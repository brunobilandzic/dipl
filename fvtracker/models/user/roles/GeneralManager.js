import mongoose from "mongoose";

const generalManagerSchema = {
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manager" }],
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model(
    "GeneralManager",
    new mongoose.Schema(generalManagerSchema)
  );
