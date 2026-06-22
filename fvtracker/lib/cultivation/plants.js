import {
  CropMainType,
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";
import utils from "@/lib/utils";
import { getCultivationById } from "./cultivation";
import { getPlantingPlanById, getPlantingPlanItemRecord } from "./plans";
import { Field } from "@/models/sectors/cultivation/Field";
import { Worker } from "@/models/user/workers";
import { PlantageWork } from "@/models/user/workers/CultivationWork";
import { plantageWorkPopulate } from "../workers/works";

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
          mainTypeName: mainType.name,
        });

        cropVarieties.forEach((variety) => {
          cropData.varieties.push({
            ...variety._doc,
            cropTypeName: cropType.name,
            generalTypeName: generalType.name,
            mainTypeName: mainType.name,
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
    throw new Error(`Crop variety not found with the provided ID`);
  }
  return cropVariety;
}

export async function createPlantage({
  cultivationId,
  cropVarietyId,
  relativeCoords,
  plantedAt,
  harvestedAt,
  plantingPlanId,
  workerId,
}) {
  const cultivation = await getCultivationById(cultivationId);
  await cultivation.populate({
    path: "cultivationArea",
    select: "planted field",
  });

  const { plantedCropVarieties, plantageWork } =
    await createPlantedCropVarietiesCells({
      cultivationId,
      cropVarietyId,
      relativeCoords,
      harvestedAt,
      plantedAt,
      planted: cultivation.cultivationArea.planted,
      plantingPlanId,
      fieldId: cultivation.cultivationArea.field,
      workerId,
    });
  return { plantedCropVarieties, plantageWork };
}

export async function createPlantedCropVarietiesCells({
  relativeCoords,
  cropVarietyId,
  planted,
  cultivationId,
  harvestedAt,
  plantedAt,
  plantingPlanId,
  fieldId,
  workerId,
}) {
  const plantedCropVarieties = [];
  const field = await Field.findById(fieldId);
  if (!field) {
    throw new Error("Field not found with the provided ID.");
  }

  if (plantingPlanId && cropVarietyId) {
    const plantingPlan = await getPlantingPlanById(plantingPlanId);
    await plantingPlan.populate({
      path: "items",
      populate: { path: "cropVariety" },
    });
    const plantingPlanItem = await getPlantingPlanItemRecord({
      plantingPlan,
      cropVarietyId,
    });
    const cropVariety = await getCropVarietyById(cropVarietyId);
    cropVariety.plantingPlanItems.push(plantingPlanItem._id);

    const plcvObjects = [];
    for (const relativeCoord of relativeCoords) {
      const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
        planted,
        cellCoords: relativeCoord,
      });
      plcvObjects.push({
        cultivation: cultivationId,
        relativeCoords: relativeCoord,
        fieldCoords,
        plantedAt,
        harvestedAt,
        plantingPlanItem: plantingPlanItem._id,
        cropVariety: cropVarietyId,
      });
    }

    await PlantedCropVariety.updateMany(
      {
        cultivation: cultivationId,
        relativeCoords: { $in: relativeCoords },
      },
      {
        cropVariety: cropVarietyId,
        plantedAt,
        harvestedAt: null,
        plantingPlanItem: plantingPlanItem._id,
      },
      { new: true },
    );

    const updatedPlcvs = await PlantedCropVariety.find({
      cultivation: cultivationId,
      relativeCoords: { $in: relativeCoords },
    })
      .select("_id plantingPlanItem")
      .populate({
        path: "plantingPlanItem",
        populate: { path: "cropVariety", populate: { path: "cropType" } },
      });

    plantingPlanItem.plantedCropVarieties.push(
      ...updatedPlcvs.map((p) => p._id),
    );
    plantingPlanItem.quantity -=
      cropVariety.quantityPerCell * updatedPlcvs.length;
    if (plantingPlanItem.quantity < 0) {
      throw new Error(
        "Nema dovoljno planiranih količina za ovu sadnju. Smanjite broj sadnih mjesta.",
      );
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      throw new Error("Worker not found with the provided ID.");
    }
    const plantageWork = new PlantageWork({
      plantingPlanItem: plantingPlanItem._id,
      cultivation: cultivationId,
      plantedCoords: relativeCoords,
      worker: workerId,
      hoursWorked: relativeCoords.length,
    });

    await plantageWork.save();
    await plantingPlanItem.save();
    await cropVariety.save();
    plantedCropVarieties.push(...updatedPlcvs);
    await plantageWork.populate(plantageWorkPopulate);
    return { plantedCropVarieties, plantageWork };
  }

  // for speed
  const plcvObjects = [];
  for (const relativeCoord of relativeCoords) {
    const fieldCoords = utils.cultivation.cultivations.relativeToFieldCoords({
      planted,
      cellCoords: relativeCoord,
    });

    plcvObjects.push({
      cultivation: cultivationId,
      relativeCoords: relativeCoord,
      fieldCoords,
      plantedAt,
      harvestedAt,
    });
  }

  const newPlantedCropVarieties =
    await PlantedCropVariety.insertMany(plcvObjects);
  plantedCropVarieties.push(...newPlantedCropVarieties);

  return plantedCropVarieties;
}
