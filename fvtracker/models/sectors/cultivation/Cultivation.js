import mongoose from "mongoose";
import utils from "@/lib/utils";
import { Field } from "./Field";
import { makeUrlFriendly } from "@/lib/utils/strings";

const { Schema } = mongoose;

const plantedCropVarietySchema = {
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    default: null,
  },
  cellCoords: {
    type: String,
    default: null,
    validate: (coords) => {
      if (coords && !/^[\d]+,[\d]+$/.test(coords)) {
        throw new Error(
          "Invalid cell coordinates format. Expected format: 'x,y'",
        );
      }
    },
  },
  fieldCoords: {
    type: String,
    default: null,
    validate: (coords) => {
      if (coords && !/^[\d]+,[\d]+$/.test(coords)) {
        throw new Error(
          "Invalid field coordinates format. Expected format: 'x,y'",
        );
      }
    },
  },
};

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
  planted: {
    type: Map,
    of: plantedCropVarietySchema,
    default: () => new Map(),
  },
  dimensions: {
    type: {
      width: { type: Number, required: true },
      length: { type: Number, required: true },
    },
    default: { width: 0, length: 0 },
  },
  soilType:
    // cultivation area consists of only one soil type
    // this is also noted here for easier access and querying
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoilType",
      default: null,
    },
});

// what the is seeded on the field grid cells
// e.g eggplants of some variety planted in some cells
// also has start and end date, status so it maybe will be used for some planning and tracking... idk yet
// harvest will probably be linked to cultivation
const cultivationSchema = new Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  cultivationArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CultivationArea",
    required: true,
  },
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  planted: {
    type: Map,
    of: plantedCropVarietySchema,
    default: () => new Map(),
  },
  workHours: [
    {
      type: {
        worker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Worker",
          required: true,
        },
        beginDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        // needs functionality to calculate total hours from begin and end date time
        // and calculate payroll based on worker pay rate
      },
    },
  ],
  status: {
    type: String,
    enum: ["u planiranju", "u toku", "završeno"],
    default: "u planiranju",
  },
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
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

cultivationSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
  }
});

export const CultivationArea =
  mongoose.models.CultivationArea ||
  mongoose.model("CultivationArea", cultivationAreaSchema);

export const Cultivation =
  mongoose.models.Cultivation ||
  mongoose.model("Cultivation", cultivationSchema);


