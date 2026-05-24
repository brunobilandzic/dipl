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
  harvests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Harvest",
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

export const CultivationWorker =
  mongoose.models.CultivationWorker ||
  Worker.discriminator("CultivationWorker", cultivationWorkerSchema);
export const PlantageWork =
  mongoose.models.PlantageWork ||
  Work.discriminator("PlantageWork", plantageWorkSchema);
