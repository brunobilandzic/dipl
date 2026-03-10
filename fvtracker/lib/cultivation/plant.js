import { CropMainType, CropVariety } from "@/models/sectors/cultivation/Crops";
import { getCultivationArea } from "./cultivationArea";
import utils from "@/lib/utils";

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
            ...variety,
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
