// base worker shema
import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
});

export const Worker =
  mongoose.models.Worker || mongoose.model("Worker", workerSchema);
