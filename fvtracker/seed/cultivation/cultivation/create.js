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
import {
  MIN_CULTIVATION_DIMENSION,
  assignCultivationPattern,
  buildAreaCells,
  getCellsBounds,
  splitCultivationCells,
} from "./layout.js";

await dbConnect();

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

  const varietiesUsedCount =
    await linkPlantedCropVarietiesByVariety(plantedCropVarieties);

  if (!hasBothPlantedAndUnplantedCells(cells)) {
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

function hasBothPlantedAndUnplantedCells(cells) {
  const hasPlanted = cells.some(({ cropVarietyId }) => Boolean(cropVarietyId));
  const hasUnplanted = cells.some(({ cropVarietyId }) => !cropVarietyId);

  return hasPlanted && hasUnplanted;
}

async function linkPlantedCropVarietiesByVariety(plantedCropVarieties) {
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

  return plantedVarietyMap.size;
}

export default seedCultivations;
