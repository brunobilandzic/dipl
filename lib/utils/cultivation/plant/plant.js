export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  const caCells = [];
  const plantedPlCvs = [];
  const emptyPlCvs = [];

  cultivationAreas.map((ca) => {
    caCells.push(...ca.planted);
    ca.cultivations.map((cu) => {
      cu.plantedCropVarieties.map((pcv) => {
        if (pcv.plantingPlanItem) plantedPlCvs.push(pcv);
        else emptyPlCvs.push(pcv);
      });
    });
  });

  return {
    totalCACells: caCells.length,
    plantedPlCvs,
    emptyPlCvs,
  };
};

export const fieldHasPlantedCropVarieties = (field) => {
  const has = field.cultivationAreas.some((ca) => {
    return ca.cultivations.some((cu) => {
      return cu.plantedCropVarieties?.length > 0;
    });
  });
  return has;
};

export const plantedCount = ({ harvestingPlans, fields, cropVarietyId }) => {
  const plantedPlCvs = fields.reduce((sum, f) => {
    for (const ca of f.cultivationAreas) {
      for (const cu of ca.cultivations) {
        for (const pcv of cu.plantedCropVarieties) {
          if (pcv.plantingPlanItem && !pcv.harvestingPlanItem) {
            const hp = harvestingPlans.find(
              (hp) => hp._id.toString() === pcv.plantingPlanItem.toString(),
            );
            if (hp) {
              sum++;
            }
          }
        }
      }
    }
  }, 0);
  const plannedPlCvs = harvestingPlans.reduce((sum, hp) => {}, 0);
};
