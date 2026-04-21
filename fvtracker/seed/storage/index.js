import { seedWarehouse } from "./warehouse";

export default {
  seed: async () => {
    const warehouse = await seedWarehouse();
  },
};
