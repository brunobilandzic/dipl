import { extractDBObject, checkEmpty, idToNames } from "./objects";
import {
  makeUrlFriendly,
  dimensionsString,
  alphanumericOnly,
  sanitize,
  testCoordinates,
} from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  getCellsInRect,
  getDimensionsCA,
  getDimensionsFromPlanted,
  plantedArrayToMap,
  prepareCulitvationArea,
  checkValidCell,
  checkValidSelection,
  adjacentCells,
  adjacentCellsGap,
  extractPlantedCells,
  getMinValuesFromPlanted,
} from "./cultivationAreas";
import { numbersInRanges } from "./formValidation";
import { extractCoords } from "./fields";
import {
  getCUSCells,
  relativeToFieldCoords,
  prepareCultivationData,
  mapCells,
  getPlCvs,
  getCUForCell,
  getCultivationNameForCell,
  getCASCultivations,
  filterCutivationCells,
  getFieldCultivations,
  fieldHasCultivations,
} from "./cultivation";
import { cvAndColor, showDate } from "./display";
import { prepareSubmitPlan } from "./plant";
import {
  getPlantedCropVarietesPerCultivation,
  getFieldsPlans,
  getPlansForCropVariety,
  getPlantingPlanItem,
} from "./plans";

export default {
  objects: {
    extractDBObject,
    checkEmpty,
    idToNames,
  },
  strings: {
    makeUrlFriendly,
    dimensionsString,
    alphanumericOnly,
    sanitize,
    testCoordinates,
  },
  cultivation: {
    cultivationAreas: {
      getCASCells,
      CAIncludesCell,
      getCAForCell,
      getCellsInRect,
      getDimensionsCA,
      getDimensionsFromPlanted,
      plantedArrayToMap,
      prepareCulitvationArea,
      checkValidCell,
      checkValidSelection,
      adjacentCells,
      adjacentCellsGap,
      getMinValuesFromPlanted,
      extractPlantedCells,
    },
    fields: {
      extractCoords,
    },
    cultivations: {
      getCUSCells,
      getPlCvs,
      relativeToFieldCoords,
      prepareCultivationData,
      mapCells,
      getCUForCell,
      getCultivationNameForCell,
      getCASCultivations,
      filterCutivationCells,
      getFieldCultivations,
      fieldHasCultivations,
    },
  },
  formValidation: {
    numbersInRanges,
  },
  display: {
    cvAndColor,
    showDate,
  },
  plant: {
    prepareSubmitPlan,
  },
  plans: {
    getPlantedCropVarietesPerCultivation,
    getFieldsPlans,
    getPlansForCropVariety,
    getPlantingPlanItem,
  },
};
