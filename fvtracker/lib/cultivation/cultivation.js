import { Cultivation } from "@/models/sectors/cultivation/Cultivation";
import { CultivationArea } from "@/models/sectors/cultivation/Cultivation";
import utils from "@/lib/utils";

export async function createCultivation(cultivation) {
  console.log("Creating cultivation with data:", cultivation);

  const {
    cultivationAreaId,
    name,
    description,
    cuCells,
    plantedCropVarieties,
    workHours,
    status,
    startDate,
    endDate,
  } = cultivation;

  const newCultivation = new Cultivation({
    cultivationArea: cultivationAreaId,
    name,
    description,
  });

  const cuArea = await CultivationArea.findById(cultivationAreaId);
  if (!cuArea) {
    throw new Error("Cultivation area not found");
  }
  cuArea.cultivations.push(newCultivation._id);
  await cuArea.save();
  await newCultivation.save();

  return newCultivation;
}

async function handleCells(cuCells) {}

async function createCellPromise(cuCell) {}
