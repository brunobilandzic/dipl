import mongoose from "mongoose";
import Cultivation from "@/models/sectors/cultivation";
const { Field, CultivationArea, Cultivation: CultivationRecord } = Cultivation;
import dbConnect from "./mongooseConnect.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";
import {
  CropGeneralType,
  CropMainType,
  CropType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops.js";

export const deleteDB = async () => {
  await dbConnect();
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const collection of collections) {
    const result = await mongoose.connection.db.dropCollection(collection.name);
  }

  console.log("All collections dropped.");
  return true;
};

export async function deleteCultivationsWithDocs() {
  await CultivationRecord.deleteMany({});
  await PlantedCropVariety.deleteMany({});
  await CultivationArea.updateMany({}, { $set: { cultivations: [] } });
  await Field.updateMany({}, { $set: { cultivations: [] } });
  await CropVariety.updateMany({}, { $set: { plantedCropVarieties: [] } });
  console.log("Deleted existing cultivations and planted crop varieties.");
}

export async function deleteFieldsWithDocs() {
  await deleteCultivationsWithDocs();
  await Field.deleteMany({});
  await CultivationArea.deleteMany({});
  await CultivationManager.updateMany({}, { $set: { fields: [] } });
  console.log(
    "Deleted existing fields, cultivation areas, and cultivations.",
  );
}

export async function deleteCrops() {
  await deleteCultivationsWithDocs();
  await CropMainType.deleteMany({});
  await CropGeneralType.deleteMany({});
  await CropType.deleteMany({});
  await CropVariety.deleteMany({});
  console.log(
    "Deleted existing crop main types, general types, types, and varieties.",
  );
}
