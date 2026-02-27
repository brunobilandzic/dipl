import { Cultivation } from "@/models/sectors/cultivation/Cultivation";
import { CultivationArea } from "@/models/sectors/cultivation/Cultivation";
import utils from "@/lib/utils";

export async function createCultivation( cultivation ) {
  const {
    cultivationArea: caId,
    name,
    description,
    plantedCropVarieties,
    workHours,
    status,
    startDate,
    endDate,
  } = cultivation;

  const newCultivation = new Cultivation({
    cultivationArea: caId,
    name,
    description,
  });

  const cuArea = await CultivationArea.findById(caId);
  if (!cuArea) {
    throw new Error("Cultivation area not found");
  }
  cuArea.cultivations.push(newCultivation._id);
  await cuArea.save();
  await newCultivation.save();

  return newCultivation;
}
