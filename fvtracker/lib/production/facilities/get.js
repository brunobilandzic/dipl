import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async ({ slug }) => {
  if (slug) {
    const facility = await ProductionFacility.findOne({ slug }).lean();
    return facility;
  }
  const facilities = await ProductionFacility.find({}).lean();
  return facilities;
};
