export const worksCoordsSum = ({ works, plant = false }) => {
  console.log("Calculating works coords sum", { works });
  return works.reduce((sum, work) => {
    const coords = plant ? work.plantedCoords : work.harvestedCoords;
    const coordsCount = coords ? coords.length : 0;
    return sum + coordsCount;
  }, 0);
};
