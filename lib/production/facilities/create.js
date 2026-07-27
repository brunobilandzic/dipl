import { ProductionFacility } from "@/models/sectors/production/Facility";

export const createFacility = async (facilityData) => {
  const facility = await ProductionFacility.create(facilityData);
  return facility;
};
