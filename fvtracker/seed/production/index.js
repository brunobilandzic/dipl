import { ProductionFacility } from "@/models/sectors/production/Facility";
import { createProducts } from "./createProducts";
import { Product } from "@/models/sectors/production/Product";
import storage from "../storage";

export default {
  seedProduction: async () => {
    await deleteProduction();
    await createProducts();
    await storage.seed();
  },
};

const deleteProduction = async () => {
  await Product.deleteMany({});
  await ProductionFacility.deleteMany({});
};
