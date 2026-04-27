import { ProductionFacility } from "@/models/sectors/production/Facility";

export const getFacilities = async ({ slug }) => {
  if (slug) {
    const facility = await ProductionFacility.findOne({ slug })
    return facility;
  }
  const facilities = await ProductionFacility.find({})
  return facilities;
};


export const populateFacilities = async (facilities) => { }