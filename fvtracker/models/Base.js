import { makeUrlFriendly } from "@/lib/utils/strings";
import { Schema } from "mongoose";
import mongoose from "mongoose";

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
  slug: {
    type: String,
  },
});

baseSchema.index({ name: 1, slug: 1, __t: 1 }, { unique: true });
baseSchema.pre("save", function () {
  this.updatedAt = new Date();
  if (this.isModified("name") || this.isNew) {
    this.slug = makeUrlFriendly(this.name);
  }
});

export const Base = mongoose.models.Base || mongoose.model("Base", baseSchema);
