import { ProductionFacility } from "@/models/sectors/production/Facility";

export async function getFacilities() {
  const productionFacilities = await ProductionFacility.find().populate([{}]);
  return productionFacilities;
}
