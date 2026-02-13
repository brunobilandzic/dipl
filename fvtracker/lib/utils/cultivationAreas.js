export function getCASCells(cultivationAreas) {
  const plantedMaps = cultivationAreas.map((ca) => ca.planted);

  const plantedCells = plantedMaps.reduce((acc, map) => {
    acc =
      map instanceof Map
        ? acc.concat(Array.from(map))
        : acc.concat(Object.keys(map));
    return acc;
  }, []);

  return plantedCells;
}

export const CAIncludesCell = (cultivationArea, x, y) => {
  console.log("checking includes z", cultivationArea?.name, x, y)
  const plantedCells = getCASCells([cultivationArea]);
  return plantedCells.includes(`${x},${y}`);
};

export const getCAForCell = (cultivationAreas, x, y) => {
  const coordinates = `${x},${y}`;
  return cultivationAreas.find((ca) =>
    getCASCells([ca]).some((cell) => cell === coordinates),
  );
};