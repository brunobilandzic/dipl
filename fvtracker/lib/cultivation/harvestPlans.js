import { HarvestPlan, HarvestPlanItem } from "@/models/documents/HarvestPlan";
import { fetchFieldById } from "./fields";

export async function deleteHarvestPlans({ fieldId, planId }) {
  await deleteHarvestPlansFromFields({ fieldId, planId });
  await deleteHarvestPlanItems({ planId });
  await deleteHarvestPlanRecords({ planId });
}

const deleteHarvestPlanItems = async ({ planId }) => {
  const filter = planId ? { harvestPlan: planId } : {};
  await HarvestPlanItem.deleteMany(filter);
};

const deleteHarvestPlanRecords = async ({ planId }) => {
  if (!planId) await HarvestPlan.deleteMany({});
  else await HarvestPlan.findByIdAndDelete(planId);
};

const deleteHarvestPlansFromFields = async ({ fieldId, planId }) => {
  const field = fieldId ? await fetchFieldById(fieldId) : null;
  if (field) {
    if (planId) {
      const planIndex = field.harvestPlans.indexOf(planId);
      if (planIndex === -1) throw new Error("Plan not found in field");
      field.harvestPlans.splice(planIndex, 1);
      await field.save();
    } else {
      field.harvestPlans = [];
      await field.save();
    }
  } else {
    const { Field } = await import("@/models/sectors/cultivation/Field");
    const fields = await Field.find({});
    for (const f of fields) {
      f.harvestPlans = [];
      await f.save();
    }
  }
};

export async function createHarvestPlan({ harvestPlanData }) {
  const field = await fetchFieldById(harvestPlanData.field);
  const { items, ...planData } = harvestPlanData;
  const harvestPlan = new HarvestPlan({ ...planData });
  field.harvestPlans.push(harvestPlan._id);
  for (const itemData of items) {
    const harvestPlanItem = new HarvestPlanItem({
      ...itemData,
      harvestPlan: harvestPlan._id,
    });
    await harvestPlanItem.save();
    harvestPlan.items.push(harvestPlanItem._id);
  }
  await field.save();
  await harvestPlan.save();
  return harvestPlan;
}

export const getHarvestPlanById = async (planId) => {
  const harvestPlan = await HarvestPlan.findById(planId).populate({
    path: "items",
    populate: { path: "cropVariety" },
  });
  if (!harvestPlan) throw new Error("Harvest plan not found.");
  return harvestPlan;
};
