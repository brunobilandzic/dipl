import { makeUrlFriendly } from "@/lib/utils/strings";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { PENDING, REQUEST_STATUSES } from "./sectors/interface/Request";

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

const requestSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  requestedTo: {
    type: Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  status: {
    type: String,
    enum: REQUEST_STATUSES,
    default: PENDING,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fullfilledAt: {
    type: Date,
    default: null,
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

requestSchema.index({ slug: 1, __t: 1 }, { unique: true });
requestSchema.pre("save", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = makeUrlFriendly(this.name);
  }
});

export const Base = mongoose.models.Base || mongoose.model("Base", baseSchema);
export const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);