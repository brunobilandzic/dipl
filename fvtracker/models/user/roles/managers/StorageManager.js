import mongoose from "mongoose";

const storageManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  storageFacility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StorageFacility",
  },
};

export const StorageManager =
  mongoose.models.StorageManager ||
  mongoose.model("StorageManager", new mongoose.Schema(storageManagerSchema));
