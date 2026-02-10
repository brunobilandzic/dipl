export function getCASCells(cultivationAreas) {
  const plantedMaps = cultivationAreas.map((ca) => ca.planted);

  const plantedCells = plantedMaps.reduce((acc, map) => {
    acc = map instanceof Map ? acc.concat(Array.from(map)) : acc.concat(Object.keys(map));
    return acc;
  }, []);


  return plantedCells;
}
