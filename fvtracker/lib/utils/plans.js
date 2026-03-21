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

export const getFieldsPlans = (fields) => {
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

export const getPlantingPlanFromFields = ({ fieldPlantingPlans, plantingPlanSlug }) => {
  for (const fieldPlan of fieldPlantingPlans) {
    const foundPlan = fieldPlan.plantingPlans.find(
      (plan) => plan.slug === plantingPlanSlug,
    );
    if (foundPlan) {
      return foundPlan;
    }
  }
  return null;
};
