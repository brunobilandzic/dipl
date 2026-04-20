import { ProductionFacility } from "@/models/sectors/production/Facility";
import { createProducts } from "./createProducts";

export default {
  seedProduction: async () => {
    await deleteProduction();
    await createProducts();
  },
};

const deleteProduction = async () => {
  await ProductionFacility.deleteMany({});
};
