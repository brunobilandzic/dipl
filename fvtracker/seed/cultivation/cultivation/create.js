import dbConnect from "@/lib/db/mongooseConnect.js";
import { deleteCultivationsWithDocs } from "@/lib/db/delete.js";
import utils from "@/lib/utils";
import {
  Cultivation,
  CultivationArea,
} from "@/models/sectors/cultivation/Cultivation.js";
import {
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops.js";

await dbConnect();

const AREA_CULTIVATION_COVERAGE = {
  min: 0.55,
  max: 0.85,
};

const CULTIVATION_PLANTING_COVERAGE = {
  min: 0.55,
  max: 0.85,
};

const MIN_CULTIVATION_DIMENSION = 2;
const MIN_CELLS_PER_CULTIVATION =
  MIN_CULTIVATION_DIMENSION * MIN_CULTIVATION_DIMENSION;
const MAX_RECTANGLE_ASPECT_RATIO = 4;
const RECTANGLE_BUILD_ATTEMPTS = 1200;
const MAX_VARIETIES_PER_CULTIVATION = 4;

export async function createCultivation({
  cultivationArea,
  index = 0,
  cultivationNumber = 1,
  cells,
  plantedAt = null,
  harvestedAt = null,
}) {
  if (!cultivationArea?.planted?.length) {
    throw new Error("Cultivation area must contain cells before seeding.");
  }

  if (!cells?.length) {
    throw new Error("Cultivation must contain at least one seeded cell.");
  }

  const cultivationDims = getCellsBounds(cells);

  if (
    cultivationDims.width < MIN_CULTIVATION_DIMENSION ||
    cultivationDims.length < MIN_CULTIVATION_DIMENSION
  ) {
    throw new Error("Cultivation dimensions must be larger than 1x1.");
  }

  const fieldName =
    cultivationArea.field?.name ||
    cultivationArea.fieldName ||
    `Field ${index + 1}`;
  const cultivationBaseName = `${fieldName} ${cultivationArea.name}`;
  const cultivationName = `${cultivationBaseName} ${cultivationNumber}`;

  const cultivation = new Cultivation({
    cultivationArea: cultivationArea._id,
    name: cultivationName,
    description: `Seeded cultivation group ${cultivationNumber} in ${cultivationArea.name} sized ${cultivationDims.width}x${cultivationDims.length} with ${cells.length} cells.`,
    startDate: plantedAt,
    endDate: harvestedAt,
  });

  const plantedCropVarieties = await PlantedCropVariety.insertMany(
    cells.map((cell) => ({
      cultivation: cultivation._id,
      cropVariety: cell.cropVarietyId || null,
      relativeCoords: cell.relativeCoords,
      fieldCoords: cell.fieldCoords,
      plantedAt,
      harvestedAt,
    })),
  );

  const plantedCropVarietyIds = plantedCropVarieties
    .filter(({ cropVariety }) => Boolean(cropVariety))
    .map(({ _id }) => _id);

  const unplantedCultivationCellsCount =
    cells.length - plantedCropVarietyIds.length;

  cultivation.plantedCropVarieties = plantedCropVarieties.map(({ _id }) => _id);
  cultivationArea.cultivations.push(cultivation._id);

  await cultivation.save();
  await cultivationArea.save();

  const plantedVarietyMap = new Map();

  plantedCropVarieties.forEach((plCv) => {
    if (!plCv.cropVariety) {
      return;
    }

    const varietyId = plCv.cropVariety.toString();
    const currentIds = plantedVarietyMap.get(varietyId) || [];
    currentIds.push(plCv._id);
    plantedVarietyMap.set(varietyId, currentIds);
  });

  await Promise.all(
    Array.from(plantedVarietyMap.entries()).map(([varietyId, plCvIds]) =>
      CropVariety.findByIdAndUpdate(varietyId, {
        $push: {
          plantedCropVarieties: {
            $each: plCvIds,
          },
        },
      }),
    ),
  );

  const varietiesUsedCount = plantedVarietyMap.size;

  const seededBands = cells.reduce(
    (acc, cell) => {
      if (cell.cropVarietyId) {
        acc.plantedBands += 1;
      } else {
        acc.unplantedBands += 1;
      }
      return acc;
    },
    {
      plantedBands: 0,
      unplantedBands: 0,
    },
  );

  if (seededBands.plantedBands === 0 || seededBands.unplantedBands === 0) {
    throw new Error(
      "Cultivation layout must include both planted and unplanted cells.",
    );
  }

  return {
    cultivation,
    cultivationCellsCount: cells.length,
    plantedCellsCount: plantedCropVarietyIds.length,
    unplantedCultivationCellsCount,
    varietiesUsedCount,
    dimensions: {
      width: cultivationDims.width,
      length: cultivationDims.length,
    },
  };
}

export async function seedCultivations() {
  await deleteCultivationsWithDocs();

  const cultivationAreas = await CultivationArea.find({}).populate({
    path: "field",
    select: "name",
  });

  if (!cultivationAreas.length) {
    throw new Error("No cultivation areas found. Seed fields first.");
  }

  const cropVarieties = await CropVariety.find({}, "_id");
  if (!cropVarieties.length) {
    throw new Error("No crop varieties found. Seed crop main types first.");
  }

  let cultivationsCreated = 0;
  let cultivationCellsAllocated = 0;
  let plantedCellsCount = 0;
  let unplantedCultivationCells = 0;
  let areaCellsLeftOutsideCultivation = 0;
  let cropVarietiesUsedTotal = 0;

  for (const [index, cultivationArea] of cultivationAreas.entries()) {
    const areaCells = buildAreaCells(cultivationArea.planted);
    const { cultivationGroup, outsideCellsCount } =
      splitCultivationCells(areaCells);

    areaCellsLeftOutsideCultivation += outsideCellsCount;

    if (!cultivationGroup.length) {
      continue;
    }

    const seededCells = assignCultivationPattern(
      cultivationGroup,
      cropVarieties,
    );
    const hasPlantedCells = seededCells.some(({ cropVarietyId }) =>
      Boolean(cropVarietyId),
    );
    const seededAt = hasPlantedCells
      ? new Date("2026-03-10T00:00:00.000Z")
      : null;

    const seededCultivation = await createCultivation({
      cultivationArea,
      index,
      cultivationNumber: 1,
      cells: seededCells,
      plantedAt: seededAt,
    });

    cultivationsCreated += 1;
    cultivationCellsAllocated += seededCultivation.cultivationCellsCount;
    plantedCellsCount += seededCultivation.plantedCellsCount;
    unplantedCultivationCells +=
      seededCultivation.unplantedCultivationCellsCount;
    cropVarietiesUsedTotal += seededCultivation.varietiesUsedCount;
  }

  return {
    cultivationAreasSeeded: cultivationAreas.length,
    cultivationsCreated,
    cultivationCellsAllocated,
    plantedCellsCount,
    unplantedCultivationCells,
    areaCellsLeftOutsideCultivation,
    plantedCropVarietiesCreated: plantedCellsCount,
    cropVarietiesUsedTotal,
  };
}

function buildAreaCells(planted) {
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

function splitCultivationCells(areaCells) {
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

  const coverage = randomBetween(
    AREA_CULTIVATION_COVERAGE.min,
    AREA_CULTIVATION_COVERAGE.max,
  );

  let cultivationCellsCount = Math.max(
    MIN_CELLS_PER_CULTIVATION,
    Math.floor(areaCells.length * coverage),
  );

  if (areaCells.length > MIN_CELLS_PER_CULTIVATION) {
    cultivationCellsCount = Math.min(
      areaCells.length - 1,
      cultivationCellsCount,
    );
  }

  const cultivationGroups = buildRectangularCultivationGroups({
    areaCells,
    cultivationCellsCount,
    cultivationCount: 1,
    bounds,
  });

  const cultivationGroup = cultivationGroups[0] || areaCells;

  return {
    cultivationGroup,
    outsideCellsCount: areaCells.length - cultivationGroup.length,
  };
}

function buildRectangularCultivationGroups({
  areaCells,
  cultivationCellsCount,
  cultivationCount,
  bounds,
}) {
  const areaCellMap = new Map(
    areaCells.map((cell) => [cell.relativeCoords, cell]),
  );
  const occupied = new Set();
  const groups = [];

  let attempts = 0;
  while (
    attempts < RECTANGLE_BUILD_ATTEMPTS &&
    groups.length < cultivationCount &&
    occupied.size < cultivationCellsCount
  ) {
    attempts += 1;

    const remainingCultivations = cultivationCount - groups.length;
    const targetCellsLeft = cultivationCellsCount - occupied.size;

    if (targetCellsLeft < MIN_CELLS_PER_CULTIVATION) {
      break;
    }

    const minCellsReserved =
      (remainingCultivations - 1) * MIN_CELLS_PER_CULTIVATION;

    const maxCellsForCurrent = Math.max(
      MIN_CELLS_PER_CULTIVATION,
      targetCellsLeft - minCellsReserved,
    );

    const rectangle = randomRectangle({
      bounds,
      maxCells: maxCellsForCurrent,
    });

    if (!rectangle) {
      continue;
    }

    const rectangleCells = getRectangleCells({
      rectangle,
      areaCellMap,
      occupied,
    });

    if (rectangleCells.length < MIN_CELLS_PER_CULTIVATION) {
      continue;
    }

    groups.push(rectangleCells);
    rectangleCells.forEach((cell) => occupied.add(cell.relativeCoords));
  }

  return groups;
}

function randomRectangle({ bounds, maxCells }) {
  const maxWidthByCells = Math.max(
    MIN_CULTIVATION_DIMENSION,
    Math.floor(Math.sqrt(maxCells) * 2),
  );

  const maxWidth = Math.min(bounds.width, maxWidthByCells);

  if (maxWidth < MIN_CULTIVATION_DIMENSION) {
    return null;
  }

  const width = randomInt(MIN_CULTIVATION_DIMENSION, maxWidth);
  const maxLengthByCells = Math.floor(maxCells / width);
  const maxLength = Math.min(bounds.length, maxLengthByCells);

  if (maxLength < MIN_CULTIVATION_DIMENSION) {
    return null;
  }

  const length = randomInt(MIN_CULTIVATION_DIMENSION, maxLength);
  const longerSide = Math.max(width, length);
  const shorterSide = Math.min(width, length);

  if (longerSide / shorterSide > MAX_RECTANGLE_ASPECT_RATIO) {
    return null;
  }

  const maxStartX = bounds.maxX - width + 1;
  const maxStartY = bounds.maxY - length + 1;

  if (maxStartX < bounds.minX || maxStartY < bounds.minY) {
    return null;
  }

  const startX = randomInt(bounds.minX, maxStartX);
  const startY = randomInt(bounds.minY, maxStartY);

  return {
    startX,
    startY,
    width,
    length,
  };
}

function getRectangleCells({ rectangle, areaCellMap, occupied }) {
  const cells = [];

  for (
    let x = rectangle.startX;
    x < rectangle.startX + rectangle.width;
    x += 1
  ) {
    for (
      let y = rectangle.startY;
      y < rectangle.startY + rectangle.length;
      y += 1
    ) {
      const coords = `${x},${y}`;

      if (occupied.has(coords)) {
        return [];
      }

      const cell = areaCellMap.get(coords);

      if (!cell) {
        return [];
      }

      cells.push(cell);
    }
  }

  return cells;
}

function assignCultivationPattern(cultivationCells, cropVarieties) {
  const bounds = getCellsBounds(cultivationCells);
  const axis = Math.random() < 0.5 ? "x" : "y";
  const axisLength = axis === "x" ? bounds.width : bounds.length;

  if (!cropVarieties.length || axisLength < 2) {
    return cultivationCells.map((cell) => ({
      ...cell,
      cropVarietyId: null,
    }));
  }

  const maxVarietyCount = Math.min(
    MAX_VARIETIES_PER_CULTIVATION,
    cropVarieties.length,
    axisLength - 1,
  );

  if (maxVarietyCount < 1) {
    return cultivationCells.map((cell) => ({
      ...cell,
      cropVarietyId: null,
    }));
  }

  const minVarietyCount = maxVarietyCount >= 2 ? 2 : 1;
  const varietyCount = randomInt(minVarietyCount, maxVarietyCount);
  const selectedVarietyIds = pickRandomDistinct(
    cropVarieties,
    varietyCount,
  ).map(({ _id }) => _id);

  const plantedCoverage = randomBetween(
    CULTIVATION_PLANTING_COVERAGE.min,
    CULTIVATION_PLANTING_COVERAGE.max,
  );

  const projectedPlantedAxis = Math.round(axisLength * plantedCoverage);
  const plantedAxis = clamp(projectedPlantedAxis, varietyCount, axisLength - 1);
  const unplantedAxis = axisLength - plantedAxis;

  const plantedSegmentSizes = splitLength(plantedAxis, varietyCount);
  const plantedSegments = plantedSegmentSizes.map((size, index) => ({
    size,
    cropVarietyId: selectedVarietyIds[index],
  }));

  const unplantedIndex = randomInt(0, plantedSegments.length);
  plantedSegments.splice(unplantedIndex, 0, {
    size: unplantedAxis,
    cropVarietyId: null,
  });

  const segments = toSegmentsWithRanges(plantedSegments);

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

function getCellsBounds(cells) {
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

  const xValues = cells.map(({ relativeCoords }) => {
    const { width } = utils.cultivation.fields.extractCoords(relativeCoords);
    return width;
  });

  const yValues = cells.map(({ relativeCoords }) => {
    const { length } = utils.cultivation.fields.extractCoords(relativeCoords);
    return length;
  });

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

function toSegmentsWithRanges(segments) {
  let cursor = 0;

  return segments.map(({ size, cropVarietyId }) => {
    const start = cursor;
    const end = cursor + size - 1;
    cursor = end + 1;

    return {
      cropVarietyId,
      start,
      end,
    };
  });
}

function splitLength(total, segmentsCount) {
  if (segmentsCount <= 0) {
    return [];
  }

  const segments = Array.from({ length: segmentsCount }, () => 1);
  let remaining = total - segmentsCount;

  while (remaining > 0) {
    const index = randomInt(0, segmentsCount - 1);
    segments[index] += 1;
    remaining -= 1;
  }

  return shuffle(segments);
}

function pickRandomDistinct(items, count) {
  return shuffle([...items]).slice(0, count);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  if (max <= min) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default seedCultivations;
