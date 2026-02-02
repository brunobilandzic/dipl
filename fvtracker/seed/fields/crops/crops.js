import allCropTypes from "@/lib/constants/cultivation/plants";
import { CropMainType } from "@/models/sectors/cultivation/Crops";

export async function seedCropMainTypes() {
  const insertMainTypes = [];
  for (const [key, mainTypeData] of allCropTypes.entries()) {
    insertMainTypes.push(new Promise (async (resolve, reject) => {
      const mainCropType = new CropMainType({
        name: mainTypeData.name,
      });
      await mainCropType.save();
      if (!mainCropType) {
        return reject(`Failed to create main crop type: ${mainTypeData.name}`);
      }
      resolve(mainCropType._id);
    }));
  }
  await Promise.all(insertMainTypes);
}

export async function seedCropGeneralTypes() {
  console.log("Seeding crop general types...");
}
