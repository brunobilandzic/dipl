import { Schema } from "mongoose";
import { Worker } from "../index";
import mongoose from "mongoose";
import { Work } from ".";

const cultivationWorkerSchema = new Schema({
  plantageWork: [
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
  cultivationWorker: {
    type: Schema.Types.ObjectId,
    ref: "CultivationWorker",
    required: true,
  },
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
