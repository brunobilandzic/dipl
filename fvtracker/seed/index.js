import SEED_TYPES from "@/seed/seedTypes";
import { optimizedParams } from "./data/fields";

export default {
  handleAPIRequest,
};

async function handleAPIRequest(seedType) {
  console.log("handling:", seedType);
  switch (seedType) {
    case SEED_TYPES.USERS:
      return await import("./users").then((module) => module.default.all());

    case SEED_TYPES.FIELD:
      return await import("./fields").then(async (module) => {
        return await module.default.create(
          optimizedParams,
          module.default.FIELD_TIME_WINDOW,
        );
      });

    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}
