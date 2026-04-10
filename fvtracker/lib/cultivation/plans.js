import {
  PlantingPlan,
  PlantingPlanItem,
} from "@/models/documents/plans/PlantingPlan";
import { deletePlansFromFields, fetchFieldById } from "./fields";
import utils from "../utils";
import {
  HarvestingPlan,
  HarvestingPlanItem,
} from "@/models/documents/plans/HarvestingPlan";
import { getCropVarietyById } from "./plants";
import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { fieldsList } from "./fields";

export async function deletePlantingPlans({ fieldId, planId }) {
  await deletePlansFromFields({ fieldId, planId });
  await deletePlantingPlanItems({ planId });
  await deletePlantingPlanRecords({ planId });
}

export async function deleteHarvestingPlans({ fieldId, planId }) {
  await deleteHarvestingPlansFromFields({ fieldId, planId });
  await deleteHarvestingPlanItems({ planId });
  await deleteHarvestingPlanRecords({ planId });
}

const deletePlantingPlanItems = async ({ planId }) => {
  const filter = planId ? { plantingPlan: planId } : {};
  await PlantingPlanItem.deleteMany(filter);
};

const deletePlantingPlanRecords = async ({ planId }) => {
  if (!planId) await PlantingPlan.deleteMany({});
  else await PlantingPlan.findByIdAndDelete(planId);
};

const deleteHarvestingPlanItems = async ({ planId }) => {
  const filter = planId ? { harvestingPlan: planId } : {};
  await HarvestingPlanItem.deleteMany(filter);
};

const deleteHarvestingPlanRecords = async ({ planId }) => {
  if (!planId) await HarvestingPlan.deleteMany({});
  else await HarvestingPlan.findByIdAndDelete(planId);
};

const deleteHarvestingPlansFromFields = async ({ fieldId, planId }) => {
  const field = fieldId ? await fetchFieldById(fieldId) : null;
  const fields = !field ? await fieldsList({}) : null;

  if (field) {
    if (planId) {
      const planIndex = field.harvestingPlans.indexOf(planId);
      if (planIndex === -1) {
        throw new Error("Plan not found in field");
      }

      field.harvestingPlans.splice(planIndex, 1);
      await field.save();
      return;
    }

    field.harvestingPlans = [];
    await field.save();
    return;
  }

  if (fields) {
    for (const f of fields) {
      f.harvestingPlans = [];
      await f.save();
    }
  }
};

export async function createPlantingPlan({ plantingPlanData }) {
  const field = await fetchFieldById(plantingPlanData.field);
  const { items, ...planData } = plantingPlanData;
  const plantingPlan = new PlantingPlan({
    ...planData,
  });
  field.plantingPlans.push(plantingPlan._id);
  for (const itemData of items) {
    const plantingPlanItem = new PlantingPlanItem({
      ...itemData,
      plantingPlan: plantingPlan._id,
    });
    const cropVariety = await getCropVarietyById(itemData.cropVariety);
    cropVariety.plantingPlanItems.push(plantingPlanItem._id);
    await cropVariety.save();
    await plantingPlanItem.save();
    plantingPlan.items.push(plantingPlanItem._id);
  }
  await field.save();
  await plantingPlan.save();
  return plantingPlan;
}

export const createHarvestingPlan = async ({ harvestingPlanData }) => {
  const field = await fetchFieldById(harvestingPlanData.field);
  const { items, ...planData } = harvestingPlanData;
  const harvestingPlan = new HarvestingPlan({
    ...planData,
  });
  field.harvestingPlans.push(harvestingPlan._id);
  for (const itemData of items) {
    const harvestingPlanItem = new HarvestingPlanItem({
      ...itemData,
      harvestingPlan: harvestingPlan._id,
    });
    const cropVariety = await getCropVarietyById(itemData.cropVariety);
    cropVariety.harvestingPlanItems.push(harvestingPlanItem._id);
    await cropVariety.save();
    await harvestingPlanItem.save();
    harvestingPlan.items.push(harvestingPlanItem._id);
  }
  await field.save();
  await harvestingPlan.save();
  return harvestingPlan;
};

export const getPlantingPlanById = async (planId) => {
  const plantingPlan = await PlantingPlan.findById(planId).populate({
    path: "items",
    populate: {
      path: "cropVariety",
    },
  });
  if (!plantingPlan) {
    throw new Error("Planting plan not found.");
  }
  return plantingPlan;
};

export const getPlantingPlanItemRecord = async ({
  plantingPlan,
  cropVarietyId,
}) => {
  const plantingPlanItemId = utils.plans.getPlantingPlanItemId({
    plantingPlan,
    cropVarietyId,
  });
  if (!plantingPlanItemId) {
    throw new Error(
      `No planting plan item found for crop variety ID: ${cropVarietyId}`,
    );
  }
  const plantingPlanItem = await getPlantingPlanItemById(plantingPlanItemId);
  return plantingPlanItem;
};

export const getPlantingPlanItemById = async (itemId) => {
  const plantingPlanItem = await PlantingPlanItem.findById(itemId);

  if (!plantingPlanItem) {
    throw new Error("Planting plan item not found.");
  }

  return plantingPlanItem;
};

export const populatePlans = async ({ plans }) => {
  for (const plan of plans) {
    await plan.populate([
      {
        path: "items",
        populate: [
          {
            path: "cropVariety",
            populate: {
              path: "cropType",
            },
          },
          {
            path: "plantedCropVarieties",
            populate: {
              path: "cultivation",
              select: "name",
            },
          },
        ],
      },
      {
        path: "field",
        select: "name _id",
      },
    ]);
  }
};

const plantingPlanWithIngredients = async ({ cropVarietyIds }) => {
  const plantingPlans = await PlantingPlan.find();
  await populatePlans({ plans: plantingPlans });
  return plantingPlans.filter((plan) =>
    plan.items.some((item) =>
      cropVarietyIds.includes(item.cropVariety._id.toString()),
    ),
  );
};
