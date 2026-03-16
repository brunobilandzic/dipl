import {
  CropMainType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import { getCultivationArea } from "./cultivationArea";
import utils from "@/lib/utils";
import { getCultivationById } from "./cultivation";
import { PlantingPlan } from "@/models/documents/PlantingPlan";
import auth from "@/lib/auth";
import { fetchGeneralAndOtherManagers } from "../auth/fetchSessionData";
import { fetchFieldById } from "./fields";

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
    throw new Error("Crop variety not found with the provided ID.");
  }
  return cropVariety;
}

export async function createPlantage({
  cultivationId,
  cropVarietyId,
  relativeCoords,
  plantedAt,
  harvestedAt,
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
}) {
  const plantedCropVarieties = [];
  for (const relativeCoord of relativeCoords) {
    const plantedCropVariety = await createPlantedCropVarietyPromise({
      cultivationId,
      relativeCoord,
      cropVarietyId,
      planted,
      harvestedAt,
      plantedAt,
    });
    plantedCropVarieties.push(plantedCropVariety);
  }
  console.log(
    "Created planted crop varieties for cells:",
    plantedCropVarieties,
  );
  return plantedCropVarieties;
}

async function createPlantedCropVarietyPromise({
  relativeCoord,
  cropVarietyId,
  planted,
  cultivationId,
  harvestedAt,
  plantedAt,
}) {
  const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
    planted,
    cellCoords: relativeCoord,
  });

  const plantedCropVariety = await PlantedCropVariety.findOneAndUpdate(
    {
      cultivation: cultivationId,
      relativeCoords: relativeCoord,
    },
    {
      cropVariety: cropVarietyId,
      fieldCoords,
      plantedAt,
      harvestedAt,
    },
    { new: true },
  );

  if (!plantedCropVariety) {
    const newPlantedCropVariety = new PlantedCropVariety({
      cultivation: cultivationId,
      relativeCoords: relativeCoord,
      fieldCoords,
      relativeCoord,
      plantedAt,
      harvestedAt,
      cropVariety: cropVarietyId,
    });
    await newPlantedCropVariety.save();
    return newPlantedCropVariety;
  }

  await plantedCropVariety.populate({
    path: "cropVariety",
    populate: "cropType",
  });

  let cropVariety = null;
  if (cropVarietyId) {
    cropVariety = await getCropVarietyById(cropVarietyId);
    cropVariety.plantedCropVarieties.push(plantedCropVariety._id);
    await cropVariety.save();
  }

  await plantedCropVariety.save();
  return plantedCropVariety;
}

export async function getPlantingPlans() {
  const { hasAccess, generalManager, otherManagers } =
    await fetchGeneralAndOtherManagers({
      managerNames: ["CultivationManager"],
    });
  if (!hasAccess) {
    throw new Error("Unauthorized access to planting plans.");
  }

  const cultivationManager = otherManagers[0];

  const getFilter = () => {
    if (generalManager) {
      return {};
    } else if (cultivationManager) {
      return { cultivationManager: cultivationManager._id };
    }
  };

  const plantingPlans = await PlantingPlan.find(getFilter());
  if (!plantingPlans) {
    throw new Error("No planting plans found.");
  }
}

export async function getPlantingPlanById(id) {
  const { hasAccess } = await fetchGeneralAndOtherManagers({
    managerNames: ["CultivationManager"],
  });

  if (!hasAccess) {
    throw new Error("Unauthorized access to planting plan.");
  }

  const plantingPlan = await PlantingPlan.findById(id);
  if (!plantingPlan) {
    throw new Error("Planting plan not found with the provided ID.");
  }

  return plantingPlan;
}

export async function createPlantingPlan({ plantingPlanData }) {
  await auth.session.specificManager({
    managerName: "CultivationManager",
  });

  const field = await fetchFieldById(plantingPlanData.field);

  const plantingPlan = new PlantingPlan({
    ...plantingPlanData,
  });
  field.plantingPlans.push(plantingPlan._id);
  
  await field.save();
  await plantingPlan.save();
  return plantingPlan;
}
