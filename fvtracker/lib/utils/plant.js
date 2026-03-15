export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  const plantedCells = cultivationAreas.flatMap((ca) => ca.planted || []);
  const plantedPlCvs = [];
  const emptyPlCvs = [];

  cultivationAreas.map((ca) =>
    ca.cultivations.map((cul) =>
      cul.plantedCropVarieties.map((pcv) => {
        if (pcv.cropVariety) plantedPlCvs.push(pcv);
        else emptyPlCvs.push(pcv);
      }),
    ),
  );

  return {
    totalCACells,
    plantedPlCvs,
    emptyPlCvs,
    plantedCells,
  };
};
