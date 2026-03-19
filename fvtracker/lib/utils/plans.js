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
            ...plItem,
            plantingPlanName: pltPlan.name,
          });
        }
      });
    });
  });
  return plans;
};
