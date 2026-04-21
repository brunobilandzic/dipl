import { seedWarehouse } from "./warehouse";

export default {
  seed: async () => {
    const warehouse = await seedWarehouse();
    console.log(`Seeded warehouse: ${warehouse.name}`);
  },
};
