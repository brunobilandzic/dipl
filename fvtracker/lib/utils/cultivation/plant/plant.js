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
    console.log("ca:", ca);
    return ca.cultivations.some((cu) => {
      console.log("cu:", cu);
      return cu.plantedCropVarieties?.length > 0;
    });
  });
  console.log("fieldHasPlantedCropVarieties has:", has);
  return has;
};
