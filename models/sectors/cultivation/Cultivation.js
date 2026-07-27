import mongoose from "mongoose";
import utils from "@/lib/utils";
import { Field } from "./Field";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { PlantageWork } from "@/models/user/workers/CultivationWork";

const { Schema } = mongoose;

const cultivationAreaSchema = new Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  cultivations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cultivation",
      default: [],
    },
  ],
  name: { type: String, required: true, default: "Područje za sadnju" },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  dimensions: {
    type: {
      width: { type: Number, required: true, default: 0 },
      length: { type: Number, required: true, default: 0 },
    },
  },
  planted: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) =>
        Array.isArray(arr) &&
        arr.every((coord) => utils.strings.testCoordinates(coord)),
      message: 'Invalid coord format, expected "number,number"',
    },
  },
});

// what the is seeded on the field grid cells
// e.g eggplants of some variety planted in some cells
// also has start and end date, status so it maybe will be used for some planning and tracking... idk yet
// harvest will probably be linked to cultivation
const cultivationSchema = new Schema({
  cultivationArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CultivationArea",
    required: true,
  },
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  plantedCropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
  plantageWorks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantageWork",
    },
  ],
  harvestWorks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestWork",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date },
  endDate: { type: Date, default: null },
});

cultivationAreaSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
  if (this.isModified("planted")) {
    const dimensions =
      utils.cultivation.cultivationAreas.getDimensionsFromPlanted(this.planted);
    this.dimensions = dimensions;
  }
});

cultivationAreaSchema.pre("deleteMany", async function () {
  const cultivationAreas = await this.model
    .find(this.getFilter())
    .populate({ path: "cultivations", select: "plantedCropVarieties" });
  await mongoose.models.PlantedCropVariety.deleteMany({
    cultivation: {
      $in: cultivationAreas
        .reduce((culs, ca) => culs.concat(ca.cultivations), [])
        .map((cul) => cul._id),
    },
  });
});

cultivationSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
  }
});

cultivationSchema.pre("deleteMany", async function () {
  await mongoose
    .model("PlantedCropVariety")
    .deleteMany({ cultivation: { $in: this.getFilter()._id } });
});

export const CultivationArea =
  mongoose.models.CultivationArea ||
  mongoose.model("CultivationArea", cultivationAreaSchema);

export const Cultivation =
  mongoose.models.Cultivation ||
  mongoose.model("Cultivation", cultivationSchema);
