import { Base } from "@/models/Base";
import mongoose, { Schema } from "mongoose";

const machineSchema = new Schema({
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
    },
  ],
});

export const Machine = Base.discriminator(
  "Machine",
  new mongoose.Schema(machineSchema),
);
