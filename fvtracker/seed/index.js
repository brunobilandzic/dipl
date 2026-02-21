import SEED_TYPES from "@/seed/seedTypes";
import users from "./users";
import fields from "./cultivation/fields";
import crops from "./cultivation/crops";
import { deleteDB } from "@/lib/db/delete";
import cultivations from "./cultivation/cultivations"

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
    case SEED_TYPES.FIELDS:
      return await fields.create();
    case SEED_TYPES.CROP_MAIN_TYPES:
      return await crops.mainTypes();
    /* case SEED_TYPES.CULTIVATIONS:
      return await cultivations.create(); */

    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}

async function seedAll() {
  await deleteDB();
  await users.all();
  await fields.create();
  await crops.mainTypes();
 // await cultivations.create();
}
