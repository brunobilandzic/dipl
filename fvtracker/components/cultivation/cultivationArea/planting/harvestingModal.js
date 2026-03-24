export function HarvestingModal({ isOpen, onCancel, onConfirm }) {}

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewHarvest_WId = ({ cultivationId, crops }) => {
  const {
    generalTypes = [],
    types = [],
    varieties: cropVarieties = [],
  } = crops || {};

  const defaultGeneralType = generalTypes[0]?._id || "";
  const defaultType =
    types.filter((t) => t.generalTypeName === generalTypes[0]?.name)[0]?._id ||
    "";
  const defaultVariety =
    cropVarieties.filter(
      (v) => v.cropTypeName === types.find((t) => t._id === defaultType)?.name,
    )[0]?._id || "";

  return {
    cultivationId: cultivationId || null,
    generalType: {
      _id: defaultGeneralType,
      name:
        generalTypes.find((gt) => gt._id === defaultGeneralType)?.name || "N/A",
    },
    type: {
      _id: defaultType,
      name: types.find((t) => t._id === defaultType)?.name || "N/A",
    },
    variety: {
      _id: defaultVariety,
      name: cropVarieties.find((v) => v._id === defaultVariety)?.name || "N/A",
    },
    plantingPlan: null,
    toPlantCells: [],
    plantedAt: new Date("2026-03-10T00:00:00Z"),
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
  };
};

const preparePlantageBody = (newPlantage) => ({
  cultivationId: newPlantage.cultivationId,
  cropVarietyId: newPlantage.variety._id,
  relativeCoords: newPlantage.toPlantCells,
  plantedAt: newPlantage.plantedAt,
  harvestedAt: newPlantage.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
});
