import { createProducts } from "./createProducts";
export default {
  seedProduction: async () => {
    await createProducts();
  },
};
