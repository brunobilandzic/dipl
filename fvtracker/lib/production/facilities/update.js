import { ProductionFacility } from "@/models/sectors/production/Facility";

export const updateFacility = async ({ facilityId, data }) => {
  const facility = await ProductionFacility.findByIdAndUpdate(
    facilityId,
    { $set: data },
    { new: true },
  );
  if (!facility) throw new Error(`Postrojenje s id-om ${facilityId} nije pronađeno.`);
  return facility;
};
