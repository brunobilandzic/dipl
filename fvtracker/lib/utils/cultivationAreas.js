import dimensionError from "../constants/errors/cultivation/dimensions";

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
  console.log("checking includes", cultivationArea?.name, x, y);
  const plantedCells = getCASCells([cultivationArea]);
  return plantedCells.includes(`${x},${y}`);
};

export const getCAForCell = (cultivationAreas, x, y) => {
  const coordinates = `${x},${y}`;
  return cultivationAreas.find((ca) =>
    getCASCells([ca]).some((cell) => cell === coordinates),
  );
};

export const getCellsInRect = (
  beginX,
  beginY,
  endX,
  endY,
  cultivationAreaDimensons,
) => {
  const valid = checkRectValidDimensions({
    beginX,
    beginY,
    endX,
    endY,
    cultivationAreaDimensons,
  });
  if (!valid) {
    return {
      error: dimensionError.CULTIVATION_AREA_DIMENSIONS(
        cultivationAreaDimensons,
      ),
    };
  }
  const planted = [];
  const xStart = Math.min(beginX, endX);
  const xEnd = Math.max(beginX, endX);
  const yStart = Math.min(beginY, endY);
  const yEnd = Math.max(beginY, endY);

  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      planted.push(`${x},${y}`);
    }
  }

  return {
    error: null,
    planted
  };
};

export const checkRectValidDimensions = ({
  beginX,
  beginY,
  endX,
  endY,
  cultivationAreaDimensons,
}) => {
  const { min_ca_dim, max_ca_dim } = cultivationAreaDimensons;
  const width = Math.abs(endX - beginX) + 1;
  const height = Math.abs(endY - beginY) + 1;
  return (
    width > 0 &&
    height > 0 &&
    width >= min_ca_dim &&
    height >= min_ca_dim &&
    width <= max_ca_dim &&
    height <= max_ca_dim
  );
};
