import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async () => {
  const facilities = await ProductionFacility.find().populate([{ path: "stocks" }]);
  return facilities;
};
