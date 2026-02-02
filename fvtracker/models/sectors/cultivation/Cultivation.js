import mongoose from "mongoose";

const { Schema } = mongoose;

const cultivationAreaSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  fieldGridCells: [
    {
      // cultivation area consists of multiple field grid cells
      // all must have same soil type
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldGridCell",
      default: [],
    },
  ],
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
  description: { type: String, default: "" },
  fieldGridCells: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldGridCell",
      default: [],
    },
  ],
  crops: [
    {
      type: {
        crop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CropVariety",
          default: [],
        },
        cell: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FieldGridCell",
          default: null,
        },
      },
    },
  ],
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

export const CultivationArea =
  mongoose.models.CultivationArea ||
  mongoose.model("CultivationArea", cultivationAreaSchema);

export const Cultivation =
  mongoose.models.Cultivation ||
  mongoose.model("Cultivation", cultivationSchema);
