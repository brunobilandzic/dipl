// base worker shema
import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    default: null,
  },
  hiredAt: {
    type: Date,
    default: Date.now,
  },
});

workerSchema.methods.getRole = async function () {
  const rootManager = await mongoose
    .model("RootManager")
    .findOne({ workers: this._id });
  return rootManager ? rootManager.managerModelName : null;
};

export const Worker =
  mongoose.models.Worker || mongoose.model("Worker", workerSchema);
