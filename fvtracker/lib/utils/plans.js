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

export const getPlansForCropVariety = ({ plantingPlans, cropVarietyId }) => {
  const plans = [];
  plantingPlans.forEach((plan) => {
    const item = plan.items.find(
      (item) => item.cropVariety._id === cropVarietyId,
    );
    if (item) {
      plans.push({
        ...plan,
        fieldName: plan.field.name,
        item,
      });
    }
  });
  return plans;
};
