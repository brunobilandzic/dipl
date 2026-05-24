import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Work, Worker } from ".";

const cultivationWorkerSchema = new Schema({
  plantageWorks: [
    {
      type: Schema.Types.ObjectId,
      ref: "PlantageWork",
      default: [],
    },
  ],
  harvestWorks: [
    {
      type: Schema.Types.ObjectId,
      ref: "HarvestWork",
      default: [],
    },
  ],
});

const plantageWorkSchema = new Schema({
  plantage: {
    type: Schema.Types.ObjectId,
    ref: "Plantage",
    required: true,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
});

const harvestWorkSchema = new Schema({
  harvestingBatchItem: {
    type: Schema.Types.ObjectId,
    ref: "HarvestingBatchItem",
    required: true,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: "CultivationWorker",
    required: true,
  },
});

export const CultivationWorker =
  mongoose.models.CultivationWorker ||
  Worker.discriminator("CultivationWorker", cultivationWorkerSchema);
export const PlantageWork =
  mongoose.models.PlantageWork ||
  Work.discriminator("PlantageWork", plantageWorkSchema);
export const HarvestWork =
  mongoose.models.HarvestWork ||
  Work.discriminator("HarvestWork", harvestWorkSchema);
