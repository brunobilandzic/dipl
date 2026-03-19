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
