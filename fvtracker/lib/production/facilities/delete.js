import { ProductionFacility } from "@/models/sectors/production/Facility";

export const deleteFacilities = async ({ facilityIds }) => {
  const result = await ProductionFacility.deleteMany({ _id: { $in: facilityIds } });
  return result;
};
