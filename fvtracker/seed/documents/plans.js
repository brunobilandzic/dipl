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

export async function createPlans({ fieldId, cropVarietyIds }) {
  const appUser = await AppUser.findOne({
    username: PRODUCTION_MANAGER_USERNAME,
  }).populate("rootManager");

  const productionManager = await ProductionManager.findOne({
    rootManager: appUser.rootManager._id,
  });
  await HarvestingPlan.deleteMany({});
  await PlantingPlan.deleteMany({});

  const { plantingPlan, harvestingPlan } = planInfo({
    fieldId,
    cropVarietyIds,
    productionManagerId: productionManager._id,
  });
  const newPlantingPlan = await createPlantingPlan({
    plantingPlanData: plantingPlan,
  });
  const newHarvestingPlan = await createHarvestingPlan({
    harvestingPlanData: harvestingPlan,
  });

  return { newPlantingPlan, newHarvestingPlan };
}
