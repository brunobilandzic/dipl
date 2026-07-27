import api from "@/lib/api";
import { checkEmpty } from "../../objects";

export const getPlantedCropVarietesPerCultivation = ({
  plantedCropVarieties,
}) => {
  const cultivationPlantedCropVarieties = {};
  plantedCropVarieties?.forEach((plantedCropVariety) => {
    if (
      !cultivationPlantedCropVarieties[plantedCropVariety.cultivation?.name]
    ) {
      cultivationPlantedCropVarieties[plantedCropVariety.cultivation?.name] =
        [];
    }
    cultivationPlantedCropVarieties[plantedCropVariety.cultivation?.name].push(
      plantedCropVariety,
    );
  });
  return cultivationPlantedCropVarieties;
};

export const _getFieldsPlans = (fields) => {
  const fieldsPlans = [];
  fields.forEach((field) => {
    if (!field.plantingPlans) return;
    fieldsPlans.push({
      fieldName: field.name,
      plantingPlans: field.plantingPlans,
    });
  });
  return fieldsPlans;
};

export const prepareSubmitPlan = (plan) => {
  const mergedItems = {};
  if (checkEmpty(plan)) return;
  plan.items.forEach((item) => {
    const key = item.cropVariety;
    if (mergedItems[key]) {
      mergedItems[key].quantity += Number(item.quantity);
    } else {
      mergedItems[key] = {
        cropVariety: key,
        quantity: Number(item.quantity),
        plannedHarvestingDate: item.plannedHarvestingDate,
      };
    }
  });
  plan.items = Object.values(mergedItems);
  const { items: _items, ...rest } = plan;

  const items = plan.items.map((item) => ({
    cropVariety: item.cropVariety,
    quantity: Number(item.quantity),
    plannedHarvestingDate: item.plannedHarvestingDate,
  }));

  return {
    ...rest,
    items,
  };
};

export const getFieldsPlans = ({ fields, plant = true }) => {
  const fieldsPlans = [];
  if (!fields || fields.length === 0) return [];
  fields.forEach((field) => {
    if (!field.plantingPlans && !field.harvestingPlans) return;
    fieldsPlans.push({
      fieldName: field.name,
      plans: plant ? field.plantingPlans : field.harvestingPlans,
    });
  });
  return fieldsPlans;
};

export const getFieldsPlantingPlans = (fields) => {
  const fieldPlans = getFieldsPlans({ fields, plant: true });
  return fieldPlans.map((fieldPlan) => {
    const { fieldName, plans } = fieldPlan;
    return {
      fieldName,
      plantingPlans: plans,
    };
  });
};

export const getFieldsHarvestingPlans = (fields) => {
  const fieldPlans = getFieldsPlans({ fields, plant: false });
  return fieldPlans.map((fieldPlan) => {
    const { fieldName, plans } = fieldPlan;
    return {
      fieldName,
      harvestingPlans: plans,
    };
  });
};

export const getFieldPlans = ({ field }) => ({
  plantingPlans: field.plantingPlans || [],
  harvestingPlans: field.harvestingPlans || [],
});

export const getPlansForCropVariety = ({
  allFieldPlans,
  cropVariety,
  plantageArea,
}) => {
  const plans = {};

  //if (checkPlansEmpty(allFieldPlans)) return plans;
  if (!cropVariety) {
    console.log("no crop variety defined in get available plans");
    return allFieldPlans;
  }

  const plantingPlans = allFieldPlans?.plantingPlans;
  const harvestingPlans = allFieldPlans?.harvestingPlans;

  plantingPlans?.forEach((plan) => {
    if (
      plan.items.some((item) => {
        return (
          item.cropVariety?._id.toString() === cropVariety._id.toString() &&
          item.quantity >= plantageArea * cropVariety.quantityPerCell
        );
      })
    ) {
      if (!plans.plantingPlans) plans.plantingPlans = [];
      plans.plantingPlans.push(plan);
    }
  });

  harvestingPlans?.forEach((plan) => {
    if (
      plan.items.some((item) => {
        return (
          item.cropVariety?.name === cropVariety.name &&
          item.quantity >= plantageArea * cropVariety.quantityPerCell
        );
      })
    ) {
      if (!plans.harvestingPlans) plans.harvestingPlans = [];
      plans.harvestingPlans.push(plan);
    }
  });

  return plans;
};

export const getPlantingPlanItemId = ({ plantingPlan, cropVarietyId }) => {
  const plantingPlanItemSubDoc = plantingPlan.items.find(
    (item) => item.cropVariety?._id.toString() === cropVarietyId.toString(),
  );
  if (!plantingPlanItemSubDoc) {
    throw new Error(
      `No planting plan item found for crop variety ID: ${cropVarietyId}`,
    );
  }

  return plantingPlanItemSubDoc._id;
};

export const getPlantingPlanFromFields = ({ fields, slug }) => {
  for (const field of fields) {
    if (!field.plantingPlans) continue;
    const foundPlan = field.plantingPlans.find((plan) => plan.slug === slug);
    if (foundPlan) {
      return foundPlan;
    }
  }
  return null;
};

export const checkPlansEmpty = (plans) => {
  if (!(plans && plans.plantingPlans && plans.harvestingPlans)) {
    console.error(
      "plans",
      !!plans,
      "plans.plantingPlans",
      !!plans?.plantingPlans,
      "plans.harvestingPlans",
      !!plans?.harvestingPlans,
    );
    throw new Error("Greška u dostupnmim planovima");
  }
};

export const deletePlans = async ({ planId, plant = true }) => {
  if (!confirm("Jeste li sigurni da želite obrisati ovaj plan?")) {
    return;
  }
  try {
    const endpoint = plant
      ? "/cultivation/plant/plan"
      : "/cultivation/harvest/plan";
    await api.delete(endpoint, { planId });
    alert("Plan obrisan");
    return true;
  } catch (error) {
    console.error("Error deleting plan:", error);
    alert("Greška pri brisanju plana: " + error.message);
    return false;
  }
};
