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

export async function deletePlantingPlans({ fieldId, planId }) {
  await deletePlansFromFields({ fieldId, planId });
  await deletePlantingPlanItems({ planId });
  await deletePlantingPlanRecords({ planId });
}

const deletePlantingPlanItems = async ({ planId }) => {
  const filter = planId ? { plantingPlan: planId } : {};
  await PlantingPlanItem.deleteMany(filter);
};

const deletePlantingPlanRecords = async ({ planId }) => {
  if (!planId) await PlantingPlan.deleteMany({});
  else await PlantingPlan.findByIdAndDelete(planId);
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
