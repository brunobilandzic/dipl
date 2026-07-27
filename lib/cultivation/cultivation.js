import {
  Cultivation,
  CultivationArea,
} from "@/models/sectors/cultivation/Cultivation";
import { createPlantedCropVarietiesCells } from "./plants";

export const getCultivationById = async (id) => {
  const cultivation = await Cultivation.findById(id);
  if (!cultivation) {
    throw new Error("Cultivation not found with the provided ID.");
  }
  return cultivation;
};

export async function createCultivation(cultivation) {
  console.log("Creating cultivation with data:", cultivation);

  const {
    cultivationAreaId,
    name,
    description,
    relativeCoords,
    cropVarietyId,
    existingCulName,
  } = cultivation;

  const cuArea = await CultivationArea.findById(cultivationAreaId);
  if (!cuArea) {
    throw new Error("Cultivation area not found");
  }
  if (existingCulName) {
    const existingCul = addEmptyPlCvs({
      existingCulName,
      cuArea,
      relativeCoords,
      cropVarietyId,
    });
    return existingCul;
  }

  const newCultivation = new Cultivation({
    cultivationArea: cultivationAreaId,
    name,
    description,
  });

  await newCultivation.save();

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    relativeCoords,
    cropVarietyId,
    planted: cuArea.planted,
    cultivationId: newCultivation._id.toString(),
    fieldId: cuArea.field.toString(),
  });

  newCultivation.plantedCropVarieties = plantedCropVarieties.map((p) => p._id);

  cuArea.cultivations.push(newCultivation._id);
  await cuArea.save();
  await newCultivation.save();

  await newCultivation.populate({
    path: "plantedCropVarieties",
  });

  return newCultivation;
}

async function addEmptyPlCvs({
  existingCulName,
  cuArea,
  relativeCoords,
  cropVarietyId,
}) {
  const existingCul = await getCultivationByProperty({
    cultivationArea: cuArea,
    property: "name",
    value: existingCulName,
  });

  if (!existingCul) {
    throw new Error("Cultivation to be added to not found");
  }

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    relativeCoords,
    cropVarietyId,
    planted: cuArea.planted,
    cultivationId: existingCul._id.toString(),
    fieldId: cuArea.field.toString(),
  });

  existingCul.plantedCropVarieties.push(
    ...plantedCropVarieties.map((p) => p._id),
  );
  await existingCul.save();

  await existingCul.populate({
    path: "plantedCropVarieties",
  });
  return existingCul;
}

export async function getCultivationByProperty({
  cultivationArea,
  property,
  value,
}) {
  await cultivationArea.populate({
    path: "cultivations",
  });

  return cultivationArea.cultivations.find((cul) => cul[property] === value);
}

export const updateCultivation = async (body) => {
  const cultivation = await Cultivation.findById(body._id);
  if (!cultivation) {
    throw new Error("Cultivation not found with the provided ID.");
  }

  const updated = Object.assign(cultivation, body);

  await updated.populate("plantedCropVarieties");

  await updated.save();
  return updated;
};

export async function deleteCultivation(id) {
  return await Cultivation.deleteMany({ _id: id });
}
