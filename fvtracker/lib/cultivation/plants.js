import {
  CropMainType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { getCultivationById } from "./cultivation";
import { PlantingPlan } from "@/models/documents/PlantingPlan";
import { fetchGeneralAndOtherManagers } from "../auth/fetchSessionData";
import { getFieldForCultivation } from "./fields";
import { getPlantingPlanItemRecord } from "./plans";

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
      plantingPlanId,
    });
    plantedCropVarieties.push(plantedCropVariety);
  }
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

  const plantingPlan = await getPlantingPlanById(plantingPlanId);
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
      cultivation: cultivation._id,
      relativeCoords: relativeCoord,
    },
    {
      cropVariety: cropVarietyId,
      fieldCoords,
      plantedAt,
      harvestedAt,
      plantingPlanItem: plantingPlanItem._id,
    },
    { new: true },
  );

  if (!plantedCropVariety) {
    throw new Error("Failed to find planted crop variety at a given cell.");
  }
  plantingPlanItem.plantedCropVarieties.push(plantedCropVariety._id);
  await plantingPlanItem.save();
  await cropVariety.save();
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

export async function getPlantingPlansFromcmfields() {
  const { hasAccess, generalManager, otherManagers } =
    await fetchGeneralAndOtherManagers({
      managerNames: ["CultivationManager"],
    });

  if (!hasAccess) {
    throw new Error("Unauthorized access to planting plans.");
  }

  if (generalManager) {
    return await PlantingPlan.find({});
  }

  const cultivationManager = otherManagers[0];

  if (!cultivationManager) {
    throw new Error("Cultivation manager not found.");
  }

  await cultivationManager.populate({
    path: "fields",
    select: "name slug plantingPlans",
    populate: {
      path: "plantingPlans",
      populate: {
        path: "cropVariety",
        populate: "cropType",
      },
    },
  });

  return cultivationManager.fields.reduce((plans, field) => {
    const fieldPlans = field.plantingPlans.map((plan) => ({
      ...plan._doc,
      fieldName: field.name,
      fieldSlug: field.slug,
    }));
    return [...plans, ...fieldPlans];
  }, []);
}

export async function getPlantingPlanById(id) {
  const plantingPlan = await PlantingPlan.findById(id);
  if (!plantingPlan) {
    throw new Error("Planting plan not found with the provided ID.");
  }

  return plantingPlan;
}
