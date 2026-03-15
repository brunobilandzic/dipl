export const fieldPlantedStatistics = (field) => {
  const cultivationAreas = field.cultivationAreas || [];
  if (field.name === "SEEDED FIELD")
    console.log("Cultivation Areas:", cultivationAreas);
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
  if (field.name === "SEEDED FIELD") {
    console.log("planted plcsvs:", plantedPlCvs);
    console.log("empty plcsvs:", emptyPlCvs);
  }

  const totalCACells = plantedCells.length;

  return {
    totalCACells,
    plantedPlCvs,
    emptyPlCvs
  };
};
