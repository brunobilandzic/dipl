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
import { getDimensionsFromPlanted } from "@/lib/utils/cultivation/fields/cultivationAreas";
import { CultivationWorker } from "@/models/user/workers/CultivationWorker";
import { getCultivationWorkerById } from "@/lib/cultivation/cultivationWorker";
import { Plantage } from "@/models/sectors/cultivation/Plantage";

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

const PLANTAGE_SIZE = 3;

export const createNewPlantage = async ({
  plantingPlan,
  cultivationDimensions,
  cultivationWorkerId,
}) => {
  await PlantedCropVariety.updateMany(
    {},
    {
      plantingPlanItem: null,
      harvestingPlanItem: null,
    },
  );
  const { width: cultWidth, length: cultLength } = cultivationDimensions;
  const varietiesNum = plantingPlan.items.length;
  const plantingCoords = [];
  let cropCoords = [];
  const map = {};

  for (
    let x = 0, y = 0, planItemIndex = 0;
    planItemIndex < varietiesNum;
    x += PLANTAGE_SIZE, planItemIndex++
  ) {
    if (x + PLANTAGE_SIZE >= cultWidth) {
      x = 0;
      y += PLANTAGE_SIZE;
    }
    if (y + PLANTAGE_SIZE >= cultLength) {
      console.log(
        "Reached the end of cultivation area, cannot plant more varieties.",
      );
      break;
    }
    cropCoords = [];
    const cropVarietyName = plantingPlan.items[planItemIndex].cropVariety.name;
    map[cropVarietyName] = [];
    for (let dx = 0; dx < PLANTAGE_SIZE && x + dx < cultWidth; dx++) {
      for (let dy = 0; dy < PLANTAGE_SIZE && y + dy < cultLength; dy++) {
        if (x + dx == cultWidth) {
          dx = 0;
          dy = cultLength + 1;
          continue;
        }
        if (y + dy == cultLength) {
          console.log("reached the end of plantage", map);
          break;
        }
        map[cropVarietyName].push(`${x + dx},${y + dy}`);
      }
    }
  }
  console.log("planted", Object.keys(map).join(", "));

  const cultivationWorker = await getCultivationWorkerById(cultivationWorkerId);
  /*   const { width: cultWidth, length: cultLength } = getDimensionsFromPlanted();
  const plantingCoords = plantingPlan.items.reduce((coords, item) => {}, []); */
  // Example coordinates for planting
  const plcvIds = [];
  for (const [key, value] of Object.entries(map)) {
    const plantingPlanItem = plantingPlan.items.find(
      (item) => item.cropVariety.name === key,
    );
    const docs = await PlantedCropVariety.find(
      { relativeCoords: { $in: value } },
      { _id: 1 },
    );

    plcvIds.push(...docs.map((d) => d._id));

    await PlantedCropVariety.updateMany(
      { _id: { $in: docs } },
      {
        plantingPlanItem: plantingPlanItem._id,
        cultivationWorker: cultivationWorkerId,
      },
    );
    plantingPlanItem.plantedCropVarieties.push(...docs.map((d) => d._id));
    plantingPlanItem.quantity -=
      docs.length * plantingPlanItem.cropVariety.quantityPerCell;
    if (plantingPlanItem.quantity < 0) {
      plantingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
    }

    await plantingPlanItem.save();
  }

  const plantage = new Plantage({
    plantedCropVarieties: plcvIds,
    cultivationWorker: cultivationWorkerId,
  });
  const plantageWork = new PlantageWork({
    cultivationWorker: cultivationWorkerId,
    plantage: plantage._id,
    hoursWorked: plcvIds.length * 0.5, // Example: 0.5 hours per planted crop variety
  });

  plantage.work = plantageWork._id;

  await plantageWork.save();
  await plantage.save();

  cultivationWorker.plantages.push(plantage._id);

  await plantage.save();

  await cultivationWorker.save();
  return map;
};

export const createNewHarvest = async ({
  harvestingPlan,
  plantedMap,
  cultivationWorkerId,
}) => {
  const cultivationWorker =
    await CultivationWorker.findById(cultivationWorkerId);

  if (!cultivationWorker) {
    throw new Error("Cultivation worker not found with the provided ID.");
  }

  for (const [cvName, plantedCoords] of Object.entries(plantedMap)) {
    const harvestingPlanItem = harvestingPlan.items.find(
      (item) => item.cropVariety.name === cvName,
    );
    if (!harvestingPlanItem) {
      continue;
    }
    const cropVarietyId = harvestingPlanItem.cropVariety._id;
    const harvestCoords = plantedCoords.slice(
      0,
      Math.floor(plantedCoords.length / 2),
    );

    const docs = await PlantedCropVariety.find(
      { relativeCoords: { $in: harvestCoords } },
      { _id: 1 },
    );
    const plcvIds = docs.map((d) => d._id);
    await PlantedCropVariety.updateMany(
      { _id: { $in: docs } },
      { harvestingPlanItem: harvestingPlanItem._id, harvestedAt: new Date() },
    );
    await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
      plantedCropVarietiesIds: plcvIds,
      cropVarietyId,
      quantityPerCell: harvestingPlanItem.cropVariety.quantityPerCell,
    });
    harvestingPlanItem.plantedCropVarieties.push(...plcvIds);
    harvestingPlanItem.quantity -=
      docs.length * harvestingPlanItem.cropVariety.quantityPerCell;
    if (harvestingPlanItem.quantity < 0) {
      harvestingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
    }
    await harvestingPlanItem.save();
  }
};

/* export const createNewHarvest_bup = async ({ harvestingPlan, plantingMap }) => {
  const harvestCoords = ["0,0", "0,1"];

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

export async function plantageHarvest({
  plantingPlan,
  harvestingPlan,
  cultivation,
}) {
  const plantedMap = await createNewPlantage({
    plantingPlan,
    cultivationDimensions: getDimensionsFromPlanted(
      cultivation.plantedCropVarieties.map((p) => p.relativeCoords),
    ),
  });

  await createNewHarvest({ harvestingPlan, cultivation, plantedMap });
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

export const seedPlantageHarvest = async ({ _fieldId, cultivation }) => {
  await deletePlantageHarvest();
  const cropVaietyNames = ["Idared", "Kristalka", "Istarski"];
  const cropVarietyIds = await CropVariety.find({
    name: { $in: cropVaietyNames },
  });
  const fieldId = await plansFieldId(_fieldId);
  const { newPlantingPlan, newHarvestingPlan } = await createPlans({
    fieldId,
    cropVarietyIds: cropVarietyIds.map((cv) => cv._id),
  });
  await newHarvestingPlan.populate([
    {
      path: "items",
      select: "plantedCropVarieties cropVariety quantity",
      populate: {
        path: "cropVariety",
        select: "quantityPerCell name",
      },
    },
    {
      path: "harvestingBatch",
    },
  ]);
  await newPlantingPlan.populate([
    {
      path: "items",
      select: "plantedCropVarieties cropVariety quantity",
      populate: {
        path: "cropVariety",
        select: "quantityPerCell name",
      },
    },
  ]);
  await plantageHarvest({
    plantingPlan: newPlantingPlan,
    harvestingPlan: newHarvestingPlan,
    cultivation,
  });
};

const plansFieldId = async (fieldId) => {
  if (!fieldId) {
    return await Field.findOne({}).then((field) => field._id);
  }
  return fieldId;
};
