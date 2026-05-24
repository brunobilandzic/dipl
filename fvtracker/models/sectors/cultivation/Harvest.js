const mongoose = require("mongoose");

const HarvestSchema = new mongoose.Schema({
  plantedCropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      required: true,
    },
  ],
  harvestedAt: {
    type: Date,
    default: Date.now,
  },
  cultivationWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CultivationWorker",
    required: true,
  },
});

module.exports =
  mongoose.models.Harvest || mongoose.model("Harvest", HarvestSchema);
