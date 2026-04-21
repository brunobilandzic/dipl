import { ProductionFacility } from "@/models/sectors/production/Facility";
import { createProducts } from "./createProducts";
import { Product } from "@/models/sectors/production/Product";

export default {
  seedProduction: async () => {
    await deleteProduction();
    await createProducts();
  },
};

const deleteProduction = async () => {
  await Product.deleteMany({});
  await ProductionFacility.deleteMany({});
};
