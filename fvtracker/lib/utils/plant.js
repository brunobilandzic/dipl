export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  const caCells = [];
  const plantedCropVarieties = [];
  const plantedPlCvs = [];
  const emptyPlCvs = [];

  cultivationAreas.map((ca) => {
    caCells.push(...ca.planted);
    ca.cultivations.map((cu) => {
      cu.plantedCropVarieties.map((pcv) => {
        if (pcv.cropVariety) plantedPlCvs.push(pcv);
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
