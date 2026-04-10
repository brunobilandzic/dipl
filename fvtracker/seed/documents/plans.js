import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import {
  PlantingPlan,
  PlantingPlanItem,
} from "@/models/documents/plans/PlantingPlan";
import { planInfo } from "../data/fields";
import {
  createHarvestingPlan,
  createPlantingPlan,
} from "@/lib/cultivation/plans";
import { PRODUCTION_MANAGER_USERNAME } from "@/lib/constants/users/managersUsernameModel";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { AppUser } from "@/models/user/AppUser";

export async function createPlans({ fieldId, cropVarietyId }) {
  const appUser = await AppUser.findOne({
    username: PRODUCTION_MANAGER_USERNAME,
  }).populate("rootManager");

  const productionManager = await ProductionManager.findOne({
    rootManager: appUser.rootManager._id,
  });
  await HarvestingPlan.deleteMany({});
  await PlantingPlan.deleteMany({});

  console.log({ fieldId, cropVarietyId });
  const { plantingPlan, harvestingPlan } = planInfo({
    fieldId,
    cropVarietyId,
    productionManagerId: productionManager._id,
  });
  const newPlantingPlan = await createPlantingPlan({
    plantingPlanData: plantingPlan,
  });
  const newHarvestingPlan = await createHarvestingPlan({
    harvestingPlanData: harvestingPlan,
  });
  console.log(
    `Created planting plan ${newPlantingPlan.name} and harvesting plan ${newHarvestingPlan.name} for field ${fieldId}.`,
  );

  return { newPlantingPlan, newHarvestingPlan };
}

export const addPlanItems = async ({ plan, ingredients }) => {
  for (const ingredient of ingredients) {
    const cropVarietyId = await getCropVarietyById(ingredient.cropVariety._id);
    const itemData = {
      cropVariety: ingredient.cropVariety,
      quantity: ingredient.quantity * 3, // increase quantity for testing
    };
    const plantingPlanItem = new PlantingPlanItem({
      ...itemData,
      plantingPlan: plan._id,
      cropVariety: cropVarietyId,
    });
    const cropVariety = await getCropVarietyById(cropVarietyId);
    cropVariety.plantingPlanItems.push(plantingPlanItem._id);
    await cropVariety.save();
    await plantingPlanItem.save();
    plan.items.push(plantingPlanItem._id);
  }
};
