// base worker shema
import { getAppUser } from "@/lib/users/appUser";
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

const workSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
});

workerSchema.pre("save", async function () {
  if (this.isNew) {
    const appUser = await getAppUser({ _id: this.appUser });
    appUser.worker = this._id;
    await appUser.save();
  }
});

workerSchema.methods.getRole = async function () {
  const rootManager = await mongoose
    .model("RootManager")
    .findOne({ workers: this._id });
  return rootManager ? rootManager.managerModelName : null;
};

export const Worker =
  mongoose.models.Worker || mongoose.model("Worker", workerSchema);
export const Work = mongoose.models.Work || mongoose.model("Work", workSchema);
