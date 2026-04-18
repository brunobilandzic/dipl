import { Base } from "@/models/Base";
import mongoose, { Schema } from "mongoose";

const machineSchema = new Schema({
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
});

machineSchema.statics.findOrCreate = async function ({ name }) {
  let machine = this.findOne({ name });
  if (machine) return machine;
  return this.create({ name });
};

export const Machine =
  mongoose.models.Machine ||
  Base.discriminator("Machine", new mongoose.Schema(machineSchema));
