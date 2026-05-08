import { getRandomString } from "@/lib/utils/strings";
import { ProductionFacility } from "@/models/sectors/production/Facility";

export const createFacility = async () => {
  const facility = new ProductionFacility({
    name: `Postrojenje ${getRandomString(5)}`,
    description: "Postrojenje inicijalizirano za potrebe razvoja aplikacije.",
    volume: 5000
  });
  await facility.save();
  return facility;
};
