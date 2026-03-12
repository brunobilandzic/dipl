import {
  CropMainType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import { getCultivationArea } from "./cultivationArea";
import utils from "@/lib/utils";
import { getCultivationById } from "./cultivation";

export async function cropsData() {
  const cropMainTypes = await CropMainType.find().populate({
    path: "generalTypes",
    populate: { path: "cropTypes", populate: { path: "cropVarieties" } },
  });
  const cropData = {
    mainTypes: [],
    generalTypes: [],
    types: [],
    varieties: [],
  };
  cropMainTypes.forEach((mainType) => {
    const { generalTypes, ...mainTypeData } = mainType._doc;
    cropData.mainTypes.push(mainTypeData);

    generalTypes.forEach((generalType) => {
      const { cropTypes, ...generalTypeData } = generalType._doc;
      cropData.generalTypes.push({
        ...generalTypeData,
        mainTypeName: mainType.name,
      });

      cropTypes.forEach((cropType) => {
        const { cropVarieties, ...cropTypeData } = cropType._doc;
        cropData.types.push({
          ...cropTypeData,
          generalTypeName: generalType.name,
        });

        cropVarieties.forEach((variety) => {
          cropData.varieties.push({
            ...variety._doc,
            cropTypeName: cropType.name,
          });
        });
      });
    });
  });

  return cropData;
}

export async function getCropVarietyById(id) {
  const cropVariety = await CropVariety.findById(id);
  if (!cropVariety) {
    throw new Error("Crop variety not found with the provided ID.");
  }
  return cropVariety;
}

//NOBODY uses this
export async function plantCropVariety({
  cropVarietyId,
  cultivationAreaId,
  cellCoords,
}) {
  const cultivationArea = await getCultivationArea(cultivationAreaId);
  const cropVariety = await getCropVarietyById(cropVarietyId);

  const fieldCoords = utils.crops.mapCords({
    planted: cultivationArea.planted,
    cellCoords,
  });

  cultivationArea.planted.set(fieldCoords, {
    cropVariety: cropVariety._id,
    plantedAt: new Date(),
  });

  cropVariety.cultivationAreas.push({
    cultivationArea: cultivationAreaId,
    cellCoords,
    fieldCoords,
  });
  await cropVariety.save();
  await cultivationArea.save();

  return {
    success: true,
    cropVariety,
    cultivationArea,
    fieldCoords,
    message: `Planted ${cropVariety.name} in cultivation area ${cultivationArea.name} at cell ${cellCoords}, field cell ${fieldCoords}.`,
  };
}

export async function createPlantage({
  cultivationId,
  varietyId,
  toPlantCells,
  plantedAt,
}) {
  const cultivation = await getCultivationById(cultivationId);
  await cultivation.populate({ path: "cultivationArea", select: "planted" });
  const cropVariety = await getCropVarietyById(varietyId);
}

export async function createPlantedCropVarietiesCells({
  relativeCoords,
  cropVarietyId,
  planted,
  cultivationId,
}) {
  const plantedCropVarieties = [];
  for (const relativeCoord of relativeCoords) {
    const plantedCropVariety = await createCellPromise({
      cultivationId,
      relativeCoord,
      cropVarietyId,
      planted,
    });
    plantedCropVarieties.push(plantedCropVariety);
  }
  return plantedCropVarieties;
}

async function createCellPromise({
  relativeCoord,
  cropVarietyId,
  planted,
  cultivationId,
}) {
  const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
    planted,
    cellCoords: relativeCoord,
  });

  const plantedCropVariety = new PlantedCropVariety({
    cropVariety: cropVarietyId || null,
    relativeCoords: relativeCoord,
    fieldCoords,
    cultivation: cultivationId,
  });

  let cropVariety = null;
  if (cropVarietyId) {
    cropVariety = await getCropVarietyById(cropVarietyId);
    cropVariety.plantedCropVarieties.push(plantedCropVariety._id);
    await cropVariety.save();
  }

  await plantedCropVariety.save();
  return plantedCropVariety;
}
