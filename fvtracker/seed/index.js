import SEED_TYPES from "@/seed/seedTypes";
import users from "./users";
import fields from "./fields";
import crops from "./fields/crops";
import { deleteDB } from "@/lib/db/delete";

export default {
  handleAPIRequest,
};

async function handleAPIRequest(seedType) {
  console.log("handling:", seedType);
  switch (seedType) {
    case SEED_TYPES.ALL:
      return await seedAll();
    case SEED_TYPES.USERS:
      return await users.all();
    case SEED_TYPES.FIELD:
      return async (optimizedParams, msWindow) =>
        await fields.create(optimizedParams, msWindow);
    case SEED_TYPES.CROP_MAIN_TYPES:
      return await crops.mainTypes();

    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}

async function seedAll() {
  await deleteDB();
  await users.all();
  await fields.create();
  await crops.mainTypes();
}
