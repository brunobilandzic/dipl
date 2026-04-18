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

machineSchema.static.findOrCreate = async ({ name }) => {
  let machine = this.findOne({ name });
  if (machine) return machine;
  machine = await this.create({ name });
};

export const Machine = Base.discriminator(
  "Machine",
  new mongoose.Schema(machineSchema),
);
