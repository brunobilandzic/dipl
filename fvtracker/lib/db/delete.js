import mongoose from "mongoose";
import  dbConnect  from "./mongooseConnect.js";

export const deleteDB = async () => {
  await dbConnect();
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Existing collections:", collections.map((col) => col.name));
  for (const collection of collections) {
    const result = await mongoose.connection.db.dropCollection(collection.name);
    console.log(`Dropped collection: ${collection.name}`, result);
  }

  console.log("All collections dropped.");
  return true;
};
