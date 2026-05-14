import { makeUrlFriendly } from "@/lib/utils/strings";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { PENDING, REQUEST_STATUSES } from "@/lib/constants/documents/requests";

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
  rejectedAt: {
    type: Date,
    default: null,
  },
});

export const Base = mongoose.models.Base || mongoose.model("Base", baseSchema);
export const RequestDocument =
  mongoose.models.RequestDocument || mongoose.model("RequestDocument", requestSchema);
