import mongoose from "mongoose";

const generalManagerSchema = {
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manager" }],
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", new mongoose.Schema(generalManagerSchema));
