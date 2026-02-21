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
  cultivationAreas,
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
  const overlaps = overlapsExistingCA(
    cultivationAreas,
    beginX,
    beginY,
    endX,
    endY,
  );
  if (overlaps) {
    return {
      error: dimensionError.CULTIVATION_AREA_OVERLAP,
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
    planted,
    dimensions: {
      width: xEnd - xStart + 1,
      length: yEnd - yStart + 1,
    },
  };
};

export const checkValidCell = ({ x, y, gap, plantedCells }) => {
  const adjacentCells = [
    `${x - gap - 1},${y}`,
    `${x + gap + 1},${y}`,
    `${x},${y - gap - 1}`,
    `${x},${y + gap + 1}`,
    `${x - gap - 1},${y - gap - 1}`,
    `${x - gap - 1},${y + gap + 1}`,
    `${x + gap + 1},${y - gap - 1}`,
    `${x + gap + 1},${y + gap + 1}`,
  ];

  if (adjacentCells.some((cell) => plantedCells.includes(cell))) {
    return { error: dimensionError.CULTIVATION_AREA_GAP(gap) };
  }
  return { error: null };
};

export const checkValidSelection = ({
  beginX,
  beginY,
  endX,
  endY,
  gap,
  plantedCells,
}) => {
  const xStart = Math.min(beginX, endX);
  const yStart = Math.min(beginY, endY);
  const xEnd = Math.max(beginX, endX);
  const yEnd = Math.max(beginY, endY);

  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      if (!checkValidCell({ x, y, gap, plantedCells })) {
        return { error: dimensionError.CULTIVATION_AREA_GAP(gap) };
      }
    }
  }
  return { error: null };
};

const checkRectValidDimensions = ({
  beginX,
  beginY,
  endX,
  endY,
  cultivationAreaDimensons,
}) => {
  const { min_ca_dim, max_ca_dim } = cultivationAreaDimensons;
  const { width, length } = getDimensionsCA(beginX, beginY, endX, endY);
  return (
    width > 0 &&
    length > 0 &&
    width >= min_ca_dim &&
    length >= min_ca_dim &&
    width <= max_ca_dim &&
    length <= max_ca_dim
  );
};

export function getDimensionsCA(beginX, beginY, endX, endY) {
  const xStart = Math.min(beginX, endX);
  const xEnd = Math.max(beginX, endX);
  const yStart = Math.min(beginY, endY);
  const yEnd = Math.max(beginY, endY);
  return {
    width: xEnd - xStart + 1,
    length: yEnd - yStart + 1,
  };
}

export function getDimensionsFromPlanted(planted) {
  const plantedCells = extractPlantedCells(planted);
  const { xValues, yValues } = getValuesFromPlanted(plantedCells);
  const width = Math.max(...xValues) - Math.min(...xValues) + 1;
  const length = Math.max(...yValues) - Math.min(...yValues) + 1;
  return { width, length };
}

function extractPlantedCells(planted) {
  const plantedCells = [];
  for (let entry of planted.entries()) {
    plantedCells.push(entry);
  }
  return plantedCells;
}

const getValuesFromPlanted = (plantedCells) => {
  const xValues = plantedCells.map((cell) => parseInt(cell[0].split(",")[0]));
  const yValues = plantedCells.map((cell) => parseInt(cell[0].split(",")[1]));
  return { xValues, yValues };
};

export function overlapsExistingCA(
  cultivationAreas,
  beginX,
  beginY,
  endX,
  endY,
) {
  const plantedCells = getCASCells(cultivationAreas);
  for (let x = Math.min(beginX, endX); x <= Math.max(beginX, endX); x++) {
    for (let y = Math.min(beginY, endY); y <= Math.max(beginY, endY); y++) {
      if (plantedCells.includes(`${x},${y}`)) {
        return true;
      }
    }
  }
  return false;
}

export function plantedArrayToMap(planted) {
  const plantedMap = new Map();
  planted?.map((pl) => plantedMap.set(pl, null));
  return plantedMap;
}

export function prepareCulitvationArea({ newCADetails, newCACoordinates }) {
  const cultivationArea = {
    ...newCADetails,
    planted: newCACoordinates.planted,
  };

  return cultivationArea;
}
