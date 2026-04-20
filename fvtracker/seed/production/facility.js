import { getRandomString } from "@/lib/utils/strings";

export const createFacility = async () => {
  const facility = new ProductionFacility({
    name: `Postrojenje ${getRandomString(5)}`,
    description: "Postrojenje inicijalizirano za potrebe razvoja aplikacije.",
  });
  await facility.save();
  return facility;
};
