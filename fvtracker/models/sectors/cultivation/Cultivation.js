import mongoose from "mongoose";
import utils from "@/lib/utils";

const { Schema } = mongoose;

const cultivationAreaSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  planted: {
    type: Map,
    of: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropVariety",
      default: null,
    },
    default: () => new Map(),
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
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  planted: {
    type: Map,
    of: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropVariety",
      default: null,
    },
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

cultivationAreaSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
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
