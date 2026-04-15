import {
  CropMainType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { getCultivationById } from "./cultivation";
import { PlantingPlan } from "@/models/documents/plans/PlantingPlan";
import { fetchManager } from "../auth/fetchSessionData";
import { getPlantingPlanItemRecord } from "./plans";
import { Field } from "@/models/sectors/cultivation/Field";

export async function cropsData() {
  const cropMainTypes = await CropMainType.find().populate({
    path: "generalTypes",
    populate: { path: "cropTypes", populate: { path: "cropVarieties" } },
  });
  const cropData = {
    mainTypes: [],
    generalTypes: [],
    types: [],
    varieties: [],
  };
  cropMainTypes.forEach((mainType) => {
    const { generalTypes, ...mainTypeData } = mainType._doc;
    cropData.mainTypes.push(mainTypeData);

    generalTypes.forEach((generalType) => {
      const { cropTypes, ...generalTypeData } = generalType._doc;
      cropData.generalTypes.push({
        ...generalTypeData,
        mainTypeName: mainType.name,
      });

      cropTypes.forEach((cropType) => {
        const { cropVarieties, ...cropTypeData } = cropType._doc;
        cropData.types.push({
          ...cropTypeData,
          generalTypeName: generalType.name,
        });

        cropVarieties.forEach((variety) => {
          cropData.varieties.push({
            ...variety._doc,
            cropTypeName: cropType.name,
          });
        });
      });
    });
  });

  return cropData;
}

export async function getCropVarietyById(id) {
  const cropVariety = await CropVariety.findById(id);
  if (!cropVariety) {
    throw new Error(`Crop variety not found with the provided ID`);
  }
  return cropVariety;
}

export async function createPlantage({
  cultivationId,
  cropVarietyId,
  relativeCoords,
  plantedAt,
  harvestedAt,
  plantingPlanId,
}) {
  const cultivation = await getCultivationById(cultivationId);
  await cultivation.populate({ path: "cultivationArea", select: "planted" });

  const plantedCropVarieties = await createPlantedCropVarietiesCells({
    cultivationId,
    cropVarietyId,
    relativeCoords,
    harvestedAt,
    plantedAt,
    planted: cultivation.cultivationArea.planted,
    plantingPlanId,
  });

  return plantedCropVarieties;
}

export async function createPlantedCropVarietiesCells({
  relativeCoords,
  cropVarietyId,
  planted,
  cultivationId,
  harvestedAt,
  plantedAt,
  plantingPlanId,
  fieldId,
}) {
  const plantedCropVarieties = [];
  const field = await Field.findById(fieldId);
  if (!field) {
    throw new Error("Field not found with the provided ID.");
  }
  for (const relativeCoord of relativeCoords) {
    const plantedCropVariety = await createPlantedCropVarietyPromise({
      cultivationId,
      relativeCoord,
      cropVarietyId,
      planted,
      harvestedAt,
      plantedAt,
      plantingPlanId,
    });
    console.log("created plcv", plantedCropVariety.relativeCoords);
    plantedCropVarieties.push(plantedCropVariety);
  }
  field.updatedAt = new Date();
  await field.save(); // to trigger field's updatedAt change
  return plantedCropVarieties;
}

async function createPlantedCropVarietyPromise({
  relativeCoord,
  cropVarietyId,
  planted,
  cultivationId,
  harvestedAt,
  plantedAt,
  plantingPlanId,
}) {
  const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
    planted,
    cellCoords: relativeCoord,
  });

  if (!cropVarietyId) {
    const newPlantedCropVariety = new PlantedCropVariety({
      cultivation: cultivationId,
      relativeCoords: relativeCoord,
      fieldCoords,
      plantedAt,
      harvestedAt,
    });
    await newPlantedCropVariety.save();
    return newPlantedCropVariety;
  }
  console.log("shall not log on seed");
  const plantingPlan = await getPlantingPlanById(plantingPlanId);
  await plantingPlan.populate({
    path: "items",
    populate: { path: "cropVariety" },
  });
  const plantingPlanItem = await getPlantingPlanItemRecord({
    plantingPlan,
    cropVarietyId,
  });
  if (!cropVarietyId) {
    throw new Error(
      "Crop variety ID is required to create a planted crop variety.",
    );
  }
  const cropVariety = await getCropVarietyById(cropVarietyId);
  cropVariety.plantingPlanItems.push(plantingPlanItem._id);
  const plantedCropVariety = await PlantedCropVariety.findOneAndUpdate(
    {
      cultivation: cultivationId,
      relativeCoords: relativeCoord,
    },
    {
      cropVariety: cropVarietyId,
      fieldCoords,
      plantedAt,
      harvestedAt: null,
      plantingPlanItem: plantingPlanItem._id,
    },
    { new: true },
  );

  if (!plantedCropVariety) {
    throw new Error("Failed to find planted crop variety at a given cell.");
  }

  await plantedCropVariety.populate({
    path: "plantingPlanItem",
    populate: { path: "cropVariety", populate: { path: "cropType" } },
  });

  plantingPlanItem.plantedCropVarieties.push(plantedCropVariety._id);
  plantingPlanItem.quantity -= cropVariety.quantityPerCell;
  if (plantingPlanItem.quantity < 0) {
    plantingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
  }

  await plantingPlanItem.save();
  await cropVariety.save();
  await plantedCropVariety.save();
  return plantedCropVariety;
}

export async function getPlantingPlanById(id) {
  const plantingPlan = await PlantingPlan.findById(id);
  if (!plantingPlan) {
    throw new Error("Planting plan not found with the provided ID.");
  }

  return plantingPlan;
}
