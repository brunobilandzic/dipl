import  SEED_TYPES  from "@/seed/seedTypes";

export default {
  handleAPIRequest,
};

async function handleAPIRequest(seedType) {
  switch (seedType) {
    case SEED_TYPES.USERS:
      return await import("./users").then((module) => module.default.all());

    case SEED_TYPES.FIELD:
      return await import("./fields").then((module) => module.default.create());

    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}
