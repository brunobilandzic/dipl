// base worker shema
import { getAppUser } from "@/lib/users/appUser";
import mongoose from "mongoose";
import { AppUser } from "../AppUser";
import { EmploymentRequest } from "./EmploymentRequest";

const workerSchema = new mongoose.Schema(
  {
    employmentRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentRequest",
      default: null,
    },
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
    hourlyRate: {
      type: Number,
      default: 0,
    },
    payedAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const workSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
    },
    isPayed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

workerSchema.pre("save", async function () {
  if (this.isNew) {
    const appUser = await getAppUser({ _id: this.appUser });
    appUser.worker = this._id;
    await appUser.save();
    const employmentRequest = new EmploymentRequest({ worker: this._id });
    await employmentRequest.save();
    this.employmentRequest = employmentRequest._id;
    const rootManager = await mongoose
      .model("RootManager")
      .findById(this.manager);
    if (rootManager) {
      rootManager.workers.push(this._id);
      await rootManager.save();
    } else {
      console.warn(
        `No root manager found for model name ${this.managerModelName}`,
      );
    }
  }
});

workerSchema.pre("deleteMany", async function () {
  const workers = await this.model.find(this.getFilter()).distinct("_id");
  await AppUser.deleteMany({ worker: { $in: workers.map((w) => w._id) } });
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
