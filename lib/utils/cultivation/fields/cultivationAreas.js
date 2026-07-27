import dimensionError from "../../../constants/errors/cultivation/dimensions";
import { extractCoords } from "./fields";
import { getCUSCells } from "./cultivation";

export function getCASCells(cultivationAreas) {
  const allPlanted = cultivationAreas.map((ca) => ca.planted);

  const plantedCells = allPlanted.reduce((acc, planted) => {
    acc = acc.concat(planted);
    return acc;
  }, []);

  return plantedCells;
}

export const CAIncludesCell = (cultivationArea, x, y) => {
  const plantedCells = getCASCells([cultivationArea]);
  return plantedCells.includes(`${x},${y}`);
};

export const getCAForCell = (cultivationAreas, x, y) => {
  const coordinates = `${x},${y}`;
  return cultivationAreas.find((ca) =>
    getCASCells([ca]).some((cell) => cell === coordinates),
  );
};

export const getCellsInRect = ({
  beginX,
  beginY,
  endX,
  endY,
  cultivationAreaDimensions,
  cultivationAreas,
  cultivations,
  toPlantCells,
  toPlantCultivation,
}) => {
  let plantedCells;
  if (cultivationAreaDimensions) {
    plantedCells = getCASCells(cultivationAreas);
    const valid = checkRectValidDimensions({
      beginX,
      beginY,
      endX,
      endY,
      cultivationAreaDimensions,
    });
    if (!valid) {
      return {
        error: dimensionError.CULTIVATION_AREA_DIMENSIONS(
          cultivationAreaDimensions,
        ),
      };
    }
  } else if (cultivations) {
    plantedCells = getCUSCells(cultivations);
  } else if (toPlantCells) {
    plantedCells = getPlCvsSeededCells(toPlantCultivation.plantedCropVarieties);
  }
  const overlaps = overlapsExistingCA(plantedCells, beginX, beginY, endX, endY);
  if (overlaps) {
    if (cultivationAreaDimensions)
      return { error: dimensionError.CULTIVATION_AREA_OVERLAP };
    if (cultivations) return { error: dimensionError.CULTIVATION_OVERLAP };
    if (toPlantCells) return { error: dimensionError.PLANT_OVERLAP };
  }

  const allCultivationCells = toPlantCultivation?.plantedCropVarieties.map(
    (plCv) => plCv.relativeCoords,
  );
  const planted = [];
  const xStart = Math.min(beginX, endX);
  const xEnd = Math.max(beginX, endX);
  const yStart = Math.min(beginY, endY);
  const yEnd = Math.max(beginY, endY);
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      if (toPlantCells && allCultivationCells?.includes(`${x},${y}`)) {
        planted.push(`${x},${y}`);
      } else if (!toPlantCells) {
        planted.push(`${x},${y}`);
      }
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
  const adjacentCells = adjacentCellsGap({ x, y, gap, plantedCells });

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
  cultivationAreaDimensions,
}) => {
  const { min_ca_dim, max_ca_dim } = cultivationAreaDimensions;
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

export function getDimensionsFromPlanted(plantedCells) {
  const { xValues, yValues } = getValuesFromPlanted(plantedCells);
  const width = Math.max(...xValues) - Math.min(...xValues) + 1;
  const length = Math.max(...yValues) - Math.min(...yValues) + 1;
  return { width, length };
}

export function extractPlantedCells(planted) {
  const plantedCells = [];
  for (let entry of planted.entries()) {
    plantedCells.push(entry);
  }
  return plantedCells;
}

const getValuesFromPlanted = (plantedCells) => {
  const xValues = plantedCells.map((cell) =>
    parseInt(extractCoords(cell).width),
  );
  const yValues = plantedCells.map((cell) =>
    parseInt(extractCoords(cell).length),
  );
  return { xValues, yValues };
};

export const getMinValuesFromPlanted = (plantedCells) => {
  const { xValues, yValues } = getValuesFromPlanted(plantedCells);
  return {
    minX: Math.min(...xValues),
    minY: Math.min(...yValues),
  };
};

export function overlapsExistingCA(plantedCells, beginX, beginY, endX, endY) {
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
    dimensions: newCACoordinates.dimensions,
    planted: newCACoordinates.planted,
  };

  return cultivationArea;
}

export function adjacentCells({ x, y, plantedCells }) {
  const adjacentCells = [
    `${x - 1},${y - 1}`,
    `${x},${y - 1}`,
    `${x + 1},${y - 1}`,
    `${x - 1},${y}`,
    `${x + 1},${y}`,
    `${x - 1},${y + 1}`,
    `${x},${y + 1}`,
  ];

  return adjacentCells.filter((cell) => plantedCells.includes(cell));
}

export function adjacentCellsGap({ x, y, gap, plantedCells }) {
  const adjacentCellsGap = [
    `${x - gap},${y}`,
    `${x},${y - gap}`,
    `${x + gap},${y}`,
    `${x},${y + gap}`,
    `${x - gap},${y - gap}`,
    `${x - gap},${y + gap}`,
    `${x + gap},${y - gap}`,
    `${x + gap},${y + gap}`,
  ];

  return adjacentCellsGap;
}

export function getPlCvsSeededCells(plCvs) {
  return (
    plCvs
      ?.filter(
        (plCv) => plCv.plantingPlanItem?.cropVariety && !plCv.harvestedAt,
      )
      ?.map((plCv) => plCv.relativeCoords) || []
  );
}

export const getCANameFromPlantedCropVarietiesInCultivation = ({
  plantedCropVariety,
}) => {
  return plantedCropVariety.cultivation?.cultivationArea?.name;
};

export const findPlantedCellCAName = ({ cultivationAreas, coords }) => {
  for (let ca of cultivationAreas) {
    if (ca.planted.includes(coords)) {
      return ca.name;
    }
  }
  return null;
};

export const getCultivationAreasArea = (cultivationAreas) => {
  return cultivationAreas.reduce((totalArea, ca) => {
    const { width, length } = ca.dimensions;
    return totalArea + width * length;
  }, 0);
};
