export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  const caCells = [];
  const plantedCropVarieties = [];
  const plantedPlCvs = [];
  const emptyPlCvs = [];

  cultivationAreas.map((ca) => {
    caCells.push(...ca.planted);
    ca.cultivations.map((cu) => {
      plantedCropVarieties.push(...cu.plantedCropVarieties);
    });
  });

  return {
    totalCACells: caCells.length,
    plantedPlCvs: plantedPlCvs.filter((plCv) => plCv.cropVariety),
    emptyPlCvs: emptyPlCvs.filter((plCv) => !plCv.cropVariety),
  };
};
