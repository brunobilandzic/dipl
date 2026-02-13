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
  console.log("checking includes z", cultivationArea?.name, x, y);
  const plantedCells = getCASCells([cultivationArea]);
  return plantedCells.includes(`${x},${y}`);
};

export const getCAForCell = (cultivationAreas, x, y) => {
  const coordinates = `${x},${y}`;
  return cultivationAreas.find((ca) =>
    getCASCells([ca]).some((cell) => cell === coordinates),
  );
};

export const getCellsInRect = (beginX, beginY, endX, endY) => {
  const cells = [];
  const xStart = Math.min(beginX, endX);
  const xEnd = Math.max(beginX, endX);
  const yStart = Math.min(beginY, endY);
  const yEnd = Math.max(beginY, endY);

  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      cells.push(`${x},${y}`);
    }
  }

  console.log("getCellsInRect:", cells)

  return cells;
};
