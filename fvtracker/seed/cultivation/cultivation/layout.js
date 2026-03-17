import utils from "@/lib/utils";

const AREA_CULTIVATION_COVERAGE = {
  min: 0.65,
  max: 0.85,
};

const UNPLANTED_STRIPE_COVERAGE = 0.2;

export const MIN_CULTIVATION_DIMENSION = 2;
const MIN_CELLS_PER_CULTIVATION =
  MIN_CULTIVATION_DIMENSION * MIN_CULTIVATION_DIMENSION;
const MAX_VARIETIES_PER_CULTIVATION = 4;

export function buildAreaCells(planted) {
  const { minX, minY } =
    utils.cultivation.cultivationAreas.getMinValuesFromPlanted(planted);

  return planted.map((cell) => {
    const { width, length } = utils.cultivation.fields.extractCoords(cell);

    return {
      fieldCoords: cell,
      relativeCoords: `${width - minX},${length - minY}`,
    };
  });
}

export function splitCultivationCells(areaCells) {
  if (areaCells.length < MIN_CELLS_PER_CULTIVATION) {
    return {
      cultivationGroup: [],
      outsideCellsCount: areaCells.length,
    };
  }

  const bounds = getCellsBounds(areaCells);

  if (
    bounds.width < MIN_CULTIVATION_DIMENSION ||
    bounds.length < MIN_CULTIVATION_DIMENSION
  ) {
    return {
      cultivationGroup: [],
      outsideCellsCount: areaCells.length,
    };
  }

  const cultivationGroup = pickRectangularCultivationGroup(areaCells, bounds);

  return {
    cultivationGroup,
    outsideCellsCount: areaCells.length - cultivationGroup.length,
  };
}

export function assignCultivationPattern(cultivationCells, cropVarieties) {
  const bounds = getCellsBounds(cultivationCells);
  const axis = bounds.width >= bounds.length ? "x" : "y";
  const axisLength = axis === "x" ? bounds.width : bounds.length;

  if (!cropVarieties.length || axisLength < 2) {
    return cultivationCells.map((cell) => ({ ...cell, cropVarietyId: null }));
  }

  const maxPlantStripes = Math.min(
    MAX_VARIETIES_PER_CULTIVATION,
    cropVarieties.length,
    axisLength - 1,
  );

  if (maxPlantStripes < 1) {
    return cultivationCells.map((cell) => ({ ...cell, cropVarietyId: null }));
  }

  const plantStripeCount = Math.min(3, maxPlantStripes);
  const selectedVarieties = shuffle([...cropVarieties]).slice(
    0,
    plantStripeCount,
  );

  const unplantedSize = clamp(
    Math.floor(axisLength * UNPLANTED_STRIPE_COVERAGE),
    1,
    axisLength - plantStripeCount,
  );

  const plantedLength = axisLength - unplantedSize;
  const plantedSizes = splitEven(plantedLength, plantStripeCount);
  const unplantedIndex = Math.floor(plantStripeCount / 2);

  const segments = [];
  let cursor = 0;

  plantedSizes.forEach((size, index) => {
    if (index === unplantedIndex) {
      segments.push({
        start: cursor,
        end: cursor + unplantedSize - 1,
        cropVarietyId: null,
      });
      cursor += unplantedSize;
    }

    segments.push({
      start: cursor,
      end: cursor + size - 1,
      cropVarietyId: selectedVarieties[index]._id,
    });
    cursor += size;
  });

  if (unplantedIndex === plantStripeCount) {
    segments.push({
      start: cursor,
      end: cursor + unplantedSize - 1,
      cropVarietyId: null,
    });
  }

  return cultivationCells.map((cell) => {
    const { width, length } = utils.cultivation.fields.extractCoords(
      cell.relativeCoords,
    );

    const offset = axis === "x" ? width - bounds.minX : length - bounds.minY;
    const segment = segments.find(
      ({ start, end }) => offset >= start && offset <= end,
    );

    return {
      ...cell,
      cropVarietyId: segment?.cropVarietyId || null,
    };
  });
}

export function getCellsBounds(cells) {
  if (!cells.length) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      width: 0,
      length: 0,
    };
  }

  const coords = cells.map(({ relativeCoords }) =>
    utils.cultivation.fields.extractCoords(relativeCoords),
  );
  const xValues = coords.map(({ width }) => width);
  const yValues = coords.map(({ length }) => length);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    length: maxY - minY + 1,
  };
}

function pickRectangularCultivationGroup(areaCells, bounds) {
  const coverage = randomBetween(
    AREA_CULTIVATION_COVERAGE.min,
    AREA_CULTIVATION_COVERAGE.max,
  );

  const targetWidth = clamp(
    Math.floor(bounds.width * coverage),
    MIN_CULTIVATION_DIMENSION,
    bounds.width > MIN_CULTIVATION_DIMENSION ? bounds.width - 1 : bounds.width,
  );

  const targetLength = clamp(
    Math.floor(bounds.length * coverage),
    MIN_CULTIVATION_DIMENSION,
    bounds.length > MIN_CULTIVATION_DIMENSION
      ? bounds.length - 1
      : bounds.length,
  );

  const startX = bounds.minX + Math.floor((bounds.width - targetWidth) / 2);
  const startY = bounds.minY + Math.floor((bounds.length - targetLength) / 2);

  const areaMap = new Map(areaCells.map((cell) => [cell.relativeCoords, cell]));
  const cultivationGroup = [];

  for (let x = startX; x < startX + targetWidth; x += 1) {
    for (let y = startY; y < startY + targetLength; y += 1) {
      const cell = areaMap.get(`${x},${y}`);
      if (cell) {
        cultivationGroup.push(cell);
      }
    }
  }

  return cultivationGroup;
}

function splitEven(total, parts) {
  const base = Math.floor(total / parts);
  const remainder = total % parts;

  return Array.from(
    { length: parts },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
