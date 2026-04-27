import { ProductionFacility } from "@/models/sectors/production/Facility";

export const createFacility = async ({ name, description }) => {
  const facility = await ProductionFacility.create({ name, description });
  return facility;
};
