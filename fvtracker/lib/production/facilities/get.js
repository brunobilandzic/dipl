import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async ({ slug }) => {
  const facilities = await ProductionFacility.find({ slug }).populate([
    { path: "stocks" },
  ]);
  return slug ? facilities[0] : facilities;
};
