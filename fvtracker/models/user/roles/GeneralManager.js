import mongoose from "mongoose";

const generalManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manager" }],
};
