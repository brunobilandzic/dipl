import allCropTypes from "@/lib/constants/cultivation/plants";
import {
  CropGeneralType,
  CropMainType,
  CropType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { deleteCrops } from "@/lib/db/delete";
import { PlantingPlan } from "@/models/documents/plans/PlantingPlan";
import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { Field } from "@/models/sectors/cultivation/Field";
import { createPlans } from "@/seed/documents/plans";

// Seed crop main types, general types, types, and varieties

// main types

export async function seedCropMainTypes() {
  /*   await deleteCrops(); */
  const cropMainTypesPromises = [];
  for (const [key, mainTypeData] of allCropTypes.entries()) {
    cropMainTypesPromises.push(createMainType(mainTypeData));
  }
  const mainTypes = await Promise.all(cropMainTypesPromises);
  console.log(`Created ${mainTypes.length} main crop types.`);
  return mainTypes;
}

async function createMainType(mainTypeData) {
  return new Promise(async (resolve, reject) => {
    const mainCropType = new CropMainType({
      name: mainTypeData.name,
    });
    if (!mainCropType) {
      return reject(`Failed to create main crop type: ${mainTypeData.name}`);
    }
    const generalTypes = await createCropGeneralTypes(
      mainCropType._id,
      mainTypeData.generalTypes,
    );

    mainCropType.generalTypes = generalTypes.map((gt) => gt.generalTypeId);
    await mainCropType.save();

    resolve({ mainType: mainCropType.name, generalTypes });
  });
}

// general types

async function createCropGeneralTypes(mainTypeId, generalTypesData) {
  const cropGeneralTypesPromises = [];
  for (const generalType of generalTypesData) {
    cropGeneralTypesPromises.push(
      createCropGeneralType(mainTypeId, generalType),
    );
  }
  const generalTypes = await Promise.all(cropGeneralTypesPromises);
  return generalTypes;
}

async function createCropGeneralType(mainTypeId, generalTypeData) {
  const dbGeneralTypeData = utils.objects.extractDBObject(generalTypeData);
  return new Promise(async (resolve, reject) => {
    const cropGeneralType = new CropGeneralType({
      mainCropType: mainTypeId,
      ...dbGeneralTypeData,
    });

    if (!cropGeneralType) {
      return reject(
        `Failed to create crop general type: ${generalTypeData.name}`,
      );
    }

    const cropTypes = await createCropTypes(
      cropGeneralType._id,
      generalTypeData.cropTypes,
    );

    cropGeneralType.cropTypes = cropTypes.map((ct) => ct.cropTypeId);
    await cropGeneralType.save();

    resolve({ generalTypeId: cropGeneralType._id, cropTypes });
  });
}

// types

async function createCropTypes(cropGeneralTypeId, cropTypesData) {
  const cropTypesPromises = [];
  for (const cropTypeData of cropTypesData) {
    cropTypesPromises.push(createCropType(cropGeneralTypeId, cropTypeData));
  }
  const cropTypes = await Promise.all(cropTypesPromises);
  return cropTypes;
}

async function createCropType(cropGeneralTypeId, cropTypeData) {
  return new Promise(async (resolve, reject) => {
    const dbCropTypeData = utils.objects.extractDBObject(cropTypeData);
    const cropType = new CropType({
      generalType: cropGeneralTypeId,
      ...dbCropTypeData,
    });

    if (!cropType) {
      return reject(`Failed to create crop type: ${cropTypeData.name}`);
    }

    const cropVarietiesIds = await createCropVarieties(
      cropType._id,
      cropTypeData.cropVarieties,
    );

    cropType.cropVarieties.push(...cropVarietiesIds);
    await cropType.save();

    resolve({ cropTypeId: cropType._id, cropVarieties: cropVarietiesIds });
  });
}

// varieties

async function createCropVarieties(cropTypeId, cropVarietiesData) {
  const cropVarietiesPromises = [];
  for (const variety of cropVarietiesData) {
    cropVarietiesPromises.push(createCropVariety(cropTypeId, variety));
  }
  const cropVarietiesIds = await Promise.all(cropVarietiesPromises);
  return cropVarietiesIds;
}

async function createCropVariety(cropTypeId, variety) {
  return new Promise(async (resolve, reject) => {
    const cropVariety = new CropVariety({
      cropType: cropTypeId,
      ...variety,
    });

    await cropVariety.save();
    if (!cropVariety) {
      return reject(`Failed to create crop variety: ${variety.name}`);
    }
    resolve(cropVariety._id);
  });
}

export function logMainTypes(mainTypes) {
  for (const mt of mainTypes) {
    console.log(
      `Created main type: ${mt.mainType} with ${mt.generalTypes.length} general types`,
    );
    for (const gt of mt.generalTypes) {
      console.log(
        `  Created general type ID: ${gt.generalTypeId} with ${gt.cropTypes.length} crop types`,
      );
      for (const ct of gt.cropTypes) {
        console.log(
          `    Created crop type ID: ${ct.cropTypeId} with ${ct.cropVarieties.length} varieties`,
        );
      }
    }
  }
}

export const createNewPlantage = async ({ plantingPlan }) => {
  await plantingPlan.populate({
    path: "items",
    select: "plantedCropVarieties cropVariety quantity",
    populate: {
      path: "cropVariety",
      select: "quantityPerCell",
    },
  });
  const plantageCoords = ["0,0", "0,1", "1,0", "1,1"]; // Example coordinates for planting
  const plantingPlanItem = plantingPlan.items[0];

  await PlantedCropVariety.updateMany(
    { relativeCoords: { $in: plantageCoords } },
    { plantingPlanItem: plantingPlanItem._id },
  );
  const plantedCropVarietes = await PlantedCropVariety.find({
    plantingPlanItem: plantingPlanItem._id,
    relativeCoords: { $in: plantageCoords },
  });

  plantingPlanItem.plantedCropVarieties.push(
    ...plantedCropVarietes.map((p) => p._id),
  );
  plantingPlanItem.quantity -=
    plantedCropVarietes.length * plantingPlanItem.cropVariety.quantityPerCell;
  if (plantingPlanItem.quantity < 0) {
    plantingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
  }
  await plantingPlanItem.save();
};

export const createNewHarvest = async ({ harvestingPlan }) => {
  const harvestCoords = ["0,0", "0,1"];
  await harvestingPlan.populate([
    {
      path: "items",
      select: "plantedCropVarieties cropVariety quantity",
      populate: {
        path: "cropVariety",
        select: "quantityPerCell",
      },
    },
    {
      path: "harvestingBatch",
    },
  ]);
  const harvestingPlanItem = harvestingPlan.items.find(
    (item) => item.cropVariety.name === "Idared",
  );
  const cropVarietyId = harvestingPlanItem.cropVariety._id;
  await PlantedCropVariety.updateMany(
    { relativeCoords: { $in: harvestCoords } },
    { harvestingPlanItem: harvestingPlanItem._id, harvestedAt: new Date() },
  );
  const plantedCropVarietes = await PlantedCropVariety.find({
    harvestingPlanItem: harvestingPlanItem._id,
    relativeCoords: { $in: harvestCoords },
  });

  const plcvids = plantedCropVarietes.map((p) => p._id);
  await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
    plantedCropVarietiesIds: plcvids,
    cropVarietyId,
    quantityPerCell: harvestingPlanItem.cropVariety.quantityPerCell,
  });
  harvestingPlanItem.plantedCropVarieties.push(...plcvids);
  harvestingPlanItem.quantity -=
    plantedCropVarietes.length * harvestingPlanItem.cropVariety.quantityPerCell;
  if (harvestingPlanItem.quantity < 0) {
    harvestingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
  }
  await harvestingPlanItem.save();
};

export async function plantageHarvest({ plantingPlan, harvestingPlan }) {
  await createNewPlantage({ plantingPlan });
  await createNewHarvest({ harvestingPlan });
}

const deletePlantageHarvest = async () => {
  await PlantedCropVariety.updateMany(
    {},
    { plantingPlanItem: null, harvestingPlanItem: null },
  );
  await PlantingPlan.deleteMany({});
  await HarvestingPlan.deleteMany({});
  await HarvestingBatch.deleteMany({});
};

export const seedPlantageHarvest = async ({ _fieldId, _cropVarietyId }) => {
  await deletePlantageHarvest();
  const cropVaietyNames = ["Idared", "Kristalka", "Istarski"];
  const cropVarietyIds = await CropVariety.find({
    name: { $in: cropVaietyNames },
  });
  console.log({ cropVarietyIds });
  const fieldId = await plansFieldId(_fieldId);
  const { newPlantingPlan, newHarvestingPlan } = await createPlans({
    fieldId,
    cropVarietyIds: cropVarietyIds.map((cv) => cv._id),
  });
  await plantageHarvest({
    plantingPlan: newPlantingPlan,
    harvestingPlan: newHarvestingPlan,
  });
};

const plansFieldId = async (fieldId) => {
  if (!fieldId) {
    return await Field.findOne({}).then((field) => field._id);
  }
  return fieldId;
};
