import mongoose from "mongoose";
import Cultivation from "@/models/sectors/cultivation";
const {Field, CultivationArea} = Cultivation;
import dbConnect from "./mongooseConnect.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";

export const deleteDB = async () => {
  await dbConnect();
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(
    "Existing collections:",
    collections.map((col) => col.name),
  );
  for (const collection of collections) {
    const result = await mongoose.connection.db.dropCollection(collection.name);
    console.log(`Dropped collection: ${collection.name}`, result);
  }

  console.log("All collections dropped.");
  return true;
};

export async function deleteFieldsWithDocs() {
  await Field.deleteMany({});
  await CultivationArea.deleteMany({});
  await CultivationManager.updateMany({}, { $set: { fields: [] } });
  console.log(
    "Deleted existing fields, cultivation areas, and field grid cells.",
  );
}
