export const getPlantedCropVarietesPerCultivation = ({
  plantedCropVarieties,
}) => {
  const cultivationPlantedCropVarieties = {};
  plantedCropVarieties?.forEach((plantedCropVariety) => {
    console.log("adding plantedCropVariety:", plantedCropVariety);
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
    console.log("field planting plans:", field.plantingPlans);
    fieldsPlans.push({
      fieldName: field.name,
      plantingPlans: field.plantingPlans,
    });
  });
  return fieldsPlans;
};

export const getFieldsPlans = ({ fields, plant = true }) => {
  const fieldsPlans = [];
  if (!fields || fields.length === 0) return [];
  fields.forEach((field) => {
    if (!field.plantingPlans && !field.harvestingPlans) return;
    console.log("field planting plans:", field.plantingPlans);
    console.log("field harvesting plans:", field.harvestingPlans);
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

export const getPlansForCropVariety = ({
  fieldPlantingPlans,
  cropVarietyId,
}) => {
  const plans = [];
  fieldPlantingPlans.forEach((fieldPlan) => {
    const { plantingPlans } = fieldPlan;
    plantingPlans.map((pltPlan) => {
      const plantingItems = pltPlan?.items;
      console.log("plantingItems:", plantingItems);
      plantingItems.map((plItem) => {
        if (plItem.cropVariety?._id === cropVarietyId) {
          plans.push({
            ...pltPlan,
          });
        }
      });
    });
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
