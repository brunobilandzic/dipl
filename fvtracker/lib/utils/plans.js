export const getPlantedCropVarietesPerCultivation = ({
  plantedCropVarieties,
}) => {
  const cultivationPlantedCropVarieties = {};
  plantedCropVarieties.forEach((plantedCropVariety) => {
    const { cultivation, ...rest } = plantedCropVariety;
    if (!cultivationPlantedCropVarieties[cultivation?.name]) {
      cultivationPlantedCropVarieties[cultivation?.name] = [];
    }
    cultivationPlantedCropVarieties[cultivation?.name].push(rest);
  });
  return cultivationPlantedCropVarieties;
};

export const getFieldsPlans = (fields) => {
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

export const getPlansForCropVariety = ({
  fieldPlantingPlans,
  cropVarietyId,
}) => {
  const plans = [];
  console.log("gaplplpr:\n\n", { fieldPlantingPlans, cropVarietyId });
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
