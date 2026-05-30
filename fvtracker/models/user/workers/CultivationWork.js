import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Worker } from ".";

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

export const CultivationWorker =
  mongoose.models.CultivationWorker ||
  Worker.discriminator("CultivationWorker", cultivationWorkerSchema);
