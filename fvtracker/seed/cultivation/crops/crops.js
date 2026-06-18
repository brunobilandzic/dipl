import allCropTypes, {
  VARIETIES_QUALITIES,
} from "@/lib/constants/cultivation/plants";
import {
  CropGeneralType,
  CropMainType,
  CropType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { PlantingPlan } from "@/models/documents/plans/PlantingPlan";
import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import {
  HarvestingBatch,
  HarvestingBatchItem,
} from "@/models/sectors/interface/HarvestingBatch";
import { Field } from "@/models/sectors/cultivation/Field";
import { createPlans } from "@/seed/documents/plans";
import { getDimensionsFromPlanted } from "@/lib/utils/cultivation/fields/cultivationAreas";
import {
  CultivationWorker,
  HarvestWork,
  PlantageWork,
} from "@/models/user/workers/CultivationWork";
import { getEmployedWorker } from "@/lib/workers/get";
import { randomElementArray } from "@/lib/utils/objects";

// Seed crop main types, general types, types, and varieties

// main types

export async function seedCropMainTypes() {
  /*   await deleteCrops(); */
  const cropMainTypesPromises = [];
  for (const [key, mainTypeData] of allCropTypes.entries()) {
    cropMainTypesPromises.push(createMainType(mainTypeData));
  }
  const mainTypes = await Promise.all(cropMainTypesPromises);
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
  cultivationId,
}) => {
  await PlantageWork.deleteMany();
  await PlantedCropVariety.updateMany(
    {},
    {
      plantingPlanItem: null,
      harvestingPlanItem: null,
    },
  );
  const { width: cultWidth, length: cultLength } = cultivationDimensions;
  const varietiesNum = plantingPlan.items.length;

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
  console.log("creating plantage");
  const cultivationWorker = await getEmployedWorker("CultivationWorker");

  let plantedLength = 0;
  for (const [key, value] of Object.entries(map)) {
    const plantingPlanItem = plantingPlan.items.find(
      (item) => item.cropVariety.name === key,
    );
    const docs = await PlantedCropVariety.find(
      { relativeCoords: { $in: value } },
      { _id: 1 },
    );

    plantedLength += docs.length;

    await PlantedCropVariety.updateMany(
      { _id: { $in: docs } },
      { plantingPlanItem: plantingPlanItem._id },
    );

    plantingPlanItem.plantedCropVarieties.push(...docs.map((d) => d._id));
    plantingPlanItem.quantity -=
      docs.length * plantingPlanItem.cropVariety.quantityPerCell;
    if (plantingPlanItem.quantity < 0) {
      plantingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
    }
    await plantingPlanItem.save();
    await cultivationWorker.save();

    const plantageWork = new PlantageWork({
      cultivation: cultivationId,
      plantingPlanItem: plantingPlanItem._id,
      hoursWorked: docs.length,
      worker: cultivationWorker._id,
      plantedCoords: value,
    });
    console.log("created plantage work", plantageWork);
    await plantageWork.save();
  }

  return map;
};

export const createNewHarvest = async ({
  harvestingPlan,
  plantedMap,
  cultivationId,
}) => {
  console.log("creating harvest...", { plantedMap });
  await HarvestingBatchItem.deleteMany();
  await HarvestWork.deleteMany();

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

    const plcvs = await PlantedCropVariety.find(
      { relativeCoords: { $in: harvestCoords } },
      "relativeCoords _id",
    );
    await PlantedCropVariety.updateMany(
      { _id: { $in: plcvs.map((plcv) => plcv._id) } },
      { harvestingPlanItem: harvestingPlanItem._id, harvestedAt: new Date() },
    );

    const plcvCopies = [...plcvs];
    const plcvLength = plcvs.length;
    const cultivationWorker = await getEmployedWorker("CultivationWorker");

    for (const quality of VARIETIES_QUALITIES) {
      const qualityPlcvs = plcvCopies.splice(
        0,
        Math.floor(plcvLength / VARIETIES_QUALITIES.length),
      );

      await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
        harvestingPlanItem,
        plantedCropVarietiesIds: qualityPlcvs.map((plcv) => plcv._id),
        cropVarietyId,
        quality,
        workerId: cultivationWorker._id,
        cultivationId,
        harvestedCoords: qualityPlcvs.map((plcv) => plcv.relativeCoords),
      });
    }
  }
};

export const createNewHarvest_bup = async ({
  harvestingPlan,
  plantedMap,
  cultivationId,
}) => {
  console.log("creating harvest...");
  await HarvestingBatchItem.deleteMany();
  await HarvestWork.deleteMany();
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
    const quality = randomElementArray(VARIETIES_QUALITIES);

    const plcvIdCopies = [...plcvIds];
    const plcvLength = plcvIds.length;
    for (const quality of VARIETIES_QUALITIES) {
      const qualityPlcvIds = plcvIdCopies.splice(
        0,
        Math.floor(plcvLength / VARIETIES_QUALITIES.length),
      );
      await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
        plantedCropVarietiesIds: qualityPlcvIds,
        cropVarietyId,
        quantityPerCell: harvestingPlanItem.cropVariety.quantityPerCell,
        quality,
      });
    }

    harvestingPlanItem.plantedCropVarieties.push(...plcvIds);
    harvestingPlanItem.quantity -=
      docs.length * harvestingPlanItem.cropVariety.quantityPerCell;
    if (harvestingPlanItem.quantity < 0) {
      harvestingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
    }

    const harvestingBatchItem = await HarvestingBatchItem.findOne({
      cropVariety: cropVarietyId,
      harvestingBatch: harvestingPlan.harvestingBatch._id,
    });
    if (!harvestingBatchItem) {
      console.warn(
        `Harvesting batch item not found for crop variety ${cvName}`,
      );
      continue;
    }

    const cultivationWorker = await getEmployedWorker("CultivationWorker");

    await harvestingBatchItem.addHarvestWork({
      hoursWorked: docs.length,
      worker: cultivationWorker._id,
      cultivation: cultivationId,
      harvestingPlanItem: harvestingPlanItem._id,
      harvestedCoords: harvestCoords,
    });
    await harvestingPlanItem.save();
  }
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
    cultivationId: cultivation._id,
  });

  await createNewHarvest({
    harvestingPlan,
    cultivationId: cultivation._id,
    plantedMap,
  });
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
