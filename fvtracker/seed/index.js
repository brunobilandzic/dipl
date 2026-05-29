import SEED_TYPES from "@/seed/seedTypes";
import users from "./users";
import fields from "./cultivation/fields";
import crops from "./cultivation/crops";
// import cultivations from "./cultivation/cultivation";
import { deleteDB } from "@/lib/db/delete";
import { CropVariety } from "@/models/sectors/cultivation/Crops";
import production from "./production";
import { Cultivation } from "@/models/sectors/cultivation/Cultivation";
import sales from "./sales";
import { createAdmin } from "./users/admin";

const seed = {
  handleAPIRequest,
};

export default seed;

async function handleAPIRequest(seedType) {
  console.log("handling:", seedType);
  switch (seedType) {
    case SEED_TYPES.ALL:
      return await seedAll();
    case SEED_TYPES.ADMIN:
      return await createAdmin();
    case SEED_TYPES.USERS:
      return await users.all();
    case SEED_TYPES.FIELDS:
      return await fields.create();
    case SEED_TYPES.CROP_MAIN_TYPES:
      return await crops.mainTypes();
    case SEED_TYPES.PRODUCTION:
      return await production.seedProduction();
    case SEED_TYPES.PLANTAGE_HARVEST:
      const cultivation = await Cultivation.findOne({}).populate(
        "plantedCropVarieties",
      );
      return await crops.plantageHarvest({ cultivation });
    case SEED_TYPES.SEED_SALES:
      return await sales.seedSales();
    case SEED_TYPES.SEED_WORKERS:
      return await users.workers();
    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}

async function seedAll() {
  await deleteDB();
  const cropsSeedResult = await crops.mainTypes();
  const cropVarietiesCount = await CropVariety.countDocuments({});
  await users.all();
  await fields.create();
  await production.seedProduction();
  await sales.seedSales();

  if (cropVarietiesCount === 0) {
    throw new Error("Seed All failed: no crop varieties were created.");
  }

  // const cultivationsSeedResult = await cultivations.create();

  return {
    cropVarietiesCount,
    cropsSeedResult,
  };
}
