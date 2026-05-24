import { Schema } from "mongoose";

const cultivationWorkerSchema = new Schema({
  plantages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plantage",
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

export const CultivationWorker =
  mongoose.models.CultivationWorker ||
  Worker.discriminator("CultivationWorker", cultivationWorkerSchema);
