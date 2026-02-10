export function getCASCells(cultivationAreas) {
  const plantedCellsMapsArray = cultivationAreas?.map((ca) => ca.planted);
  const plantedCells =
    plantedCellsMapsArray?.reduce((acc, plantedMap) => {
      return acc.concat(
        typeof plantedMap === "object"
          ? Object.keys(plantedMap) || []
          : Array.from(plantedMap || []),
      );
    }, []) || [];

  return plantedCells;
}
