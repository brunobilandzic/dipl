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

const plantageWorkSchema = new Schema(
  {
    plantingPlanItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantingPlanItem",
      required: true,
    },
    cultivation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cultivation",
    },
    plantedCoords: [
      {
        type: String,
        default: null,
      },
    ],
  },
  { timestamps: true },
);

plantageWorkSchema.pre("save", async function () {
  if (this.isNew) {
    const plantingPlanItem = await mongoose
      .model("PlantingPlanItem")
      .findById(this.plantingPlanItem)
      .populate("cropVariety");
    if (plantingPlanItem) {
      plantingPlanItem.plantageWorks.push(this._id);
      await plantingPlanItem.save();
    } else
      throw new Error(
        "PlantageWork must be associated with a valid PlantingPlanItem",
      );
    const cultivation = await mongoose
      .model("Cultivation")
      .findById(this.cultivation);

    if (cultivation) {
      cultivation.plantageWorks.push(this._id);
      await cultivation.save();
    } else {
      throw new Error(
        "PlantageWork must be associated with a valid Cultivation",
      );
    }

    const cultivationWorker = await mongoose
      .model("CultivationWorker")
      .findById(this.worker);
    if (cultivationWorker) {
      cultivationWorker.plantageWorks.push(this._id);
      await cultivationWorker.save();
    } else {
      throw new Error(
        "PlantageWork must be associated with a valid CultivationWorker",
      );
    }
  }
});

plantageWorkSchema.pre("deleteMany", async function () {
  const ids = await PlantageWork.find(this.getFilter()).distinct("_id");
  if (!ids.length) return;
  await mongoose
    .model("PlantingPlanItem")
    .updateMany(
      { plantageWorks: { $in: ids } },
      { $pull: { plantageWorks: { $in: ids } } },
    );
  await mongoose
    .model("Cultivation")
    .updateMany(
      { plantageWorks: { $in: ids } },
      { $pull: { plantageWorks: { $in: ids } } },
    );
  await mongoose
    .model("CultivationWorker")
    .updateMany(
      { plantageWorks: { $in: ids } },
      { $pull: { plantageWorks: { $in: ids } } },
    );
});

const harvestWorkSchema = new Schema(
  {
    cultivation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cultivation",
    },
    harvestingPlanItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingPlanItem",
    },
    harvestingBatchItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingBatchItem",
    },
    harvestedCoords: [
      {
        type: String,
        default: null,
      },
    ],
  },
  { timestamps: true },
);

harvestWorkSchema.pre("save", async function () {
  if (this.isNew) {
    const harvestingPlanItem = await mongoose
      .model("HarvestingPlanItem")
      .findById(this.harvestingPlanItem);
    if (harvestingPlanItem) {
      harvestingPlanItem.harvestWorks.push(this._id);
      await harvestingPlanItem.save();
    } else
      throw new Error(
        "HarvestWork must be associated with a valid HarvestingPlanItem",
      );
    const cultivation = await mongoose
      .model("Cultivation")
      .findById(this.cultivation);
    if (cultivation) {
      cultivation.harvestWorks.push(this._id);
      await cultivation.save();
    } else {
      throw new Error(
        "HarvestWork must be associated with a valid Cultivation",
      );
    }
    const cultivationWorker = await mongoose
      .model("CultivationWorker")
      .findById(this.worker);
    if (cultivationWorker) {
      cultivationWorker.harvestWorks.push(this._id);
      await cultivationWorker.save();
    } else {
      throw new Error(
        "HarvestWork must be associated with a valid CultivationWorker",
      );
    }
  }
});

harvestWorkSchema.pre("deleteMany", async function () {
  const ids = await HarvestWork.find(this.getFilter()).distinct("_id");
  if (!ids.length) return;
  await mongoose
    .model("HarvestingPlanItem")
    .updateMany(
      { harvestWorks: { $in: ids } },
      { $pull: { harvestWorks: { $in: ids } } },
    );
  await mongoose
    .model("Cultivation")
    .updateMany(
      { harvestWorks: { $in: ids } },
      { $pull: { harvestWorks: { $in: ids } } },
    );
  await mongoose
    .model("CultivationWorker")
    .updateMany(
      { harvestWorks: { $in: ids } },
      { $pull: { harvestWorks: { $in: ids } } },
    );
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
