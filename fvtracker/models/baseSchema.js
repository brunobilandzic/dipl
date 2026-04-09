import { Schema } from "mongoose";

const baseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

baseSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const Base = mongoose.models.Base || mongoose.model("Base", baseSchema);
