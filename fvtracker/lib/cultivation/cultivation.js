import {
  Cultivation,
  CultivationArea,
} from "@/models/sectors/cultivation/Cultivation";
import { PlantedCropVariety } from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { getCropVarietyById } from "./plant";

export async function createCultivation(cultivation) {
  console.log("Creating cultivation with data:", cultivation);

  const {
    cultivationAreaId,
    name,
    description,
    relativeCoords,
    cropVarietyId,
    existingCulName,
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

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    relativeCoords,
    cropVarietyId,
    planted: cuArea.planted,
    cultivationId: newCultivation._id.toString(),
  });

  newCultivation.plantedCropVarieties = plantedCropVarieties.map((p) => p._id);

  cuArea.cultivations.push(newCultivation._id);
  await cuArea.save();
  await newCultivation.save();

  await newCultivation.populate({
    path: "plantedCropVarieties",
    populate: { path: "cropVariety", populate: { path: "cropType" } },
  });

  return newCultivation;
}

async function createPlantedCropVarietiesCells({
  relativeCoords,
  cropVarietyId,
  planted,
  cultivationId,
}) {
  const plantedCropVarieties = [];
  for (const relativeCoord of relativeCoords) {
    const plantedCropVariety = await createCellPromise({
      cultivationId,
      relativeCoord,
      cropVarietyId,
      planted,
    });
    plantedCropVarieties.push(plantedCropVariety);
  }
  return plantedCropVarieties;
}

async function createCellPromise({
  relativeCoord,
  cropVarietyId,
  planted,
  cultivationId,
}) {
  const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
    planted,
    cellCoords: relativeCoord,
  });
  let cropVariety = null;

  if (cropVarietyId) {
    cropVariety = await getCropVarietyById(cropVarietyId);
    if (!cropVariety) {
      throw new Error("Crop variety not found with the provided ID.");
    }
  }

  const plantedCropVariety = new PlantedCropVariety({
    cropVariety: cropVariety?._id || null,
    relativeCoords: relativeCoord,
    fieldCoords,
    cultivation: cultivationId,
  });

  await plantedCropVariety.save();
  return plantedCropVariety;
}

export async function getCultivationByProperty({cultivationArea, property, value}) {
  await cultivationArea.populate({
    path: "cultivations",
    populate: {
      path: "plantedCropVarieties",
      populate: { path: "cropVariety", populate: { path: "cropType" } },
    },
  });

  return cultivationArea.cultivations.find((cul) => cul[property] === value);
}