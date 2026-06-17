export const worksCoordsSum = ({ works, plant = false }) => {
  return works.reduce((sum, work) => {
    const coords = plant ? work.plantedCoords : work.harvestedCoords;
    const coordsCount = coords ? coords.length : 0;
    return sum + coordsCount;
  }, 0);
};

export const cultivatedVarieties = ({ works, plant = false }) => {
  const varietiesMap = new Map();
  works.forEach((work) => {
    const plantName = plant
      ? `${work.plantingPlantItem.cropVariety.cropType} - ${work.plantingPlantItem.cropVariety.name}`
      : `${work.plantingPlantItem.cropVariety.name} - ${work.plantingPlantItem.cropVariety.name}`;
    if (!varietiesMap.has(plantName)) {
      varietiesMap.set(plantName, 0);
    }
    const quantityPerCell = plant
      ? work.plantingPlantItem.cropVariety.quantityPerCell
      : work.harvestingPlanItem.cropVariety.quantityPerCell;
    const coordsCount = plant
      ? work.plantedCoords.length
      : work.harvestedCoords.length;
    varietiesMap.set(
      plantName,
      varietiesMap.get(plantName) + coordsCount * quantityPerCell,
    );
  });
  return Array.from(varietiesMap.entries()).map(([name, quantity]) => ({
    name,
    quantity,
  }));
};
