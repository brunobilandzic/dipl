import {
  extractDBObject,
  checkEmpty,
  idToNames,
  stringifyObjectValues,
} from "./objects";
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
  getCANameFromPlantedCropVarietiesInCultivation,
  findPlantedCellCAName,
} from "./cultivation/fields/cultivationAreas";
import { numbersInRanges } from "./formValidation";
import { extractCoords, refreshFields } from "./cultivation/fields/fields";
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
} from "./cultivation/fields/cultivation";
import { cvAndColor, showDate } from "./display";
import {} from "./cultivation/plant/plant";
import {
  getPlantedCropVarietesPerCultivation,
  getFieldsPlans,
  getPlansForCropVariety,
  getPlantingPlanItemId,
  getPlantingPlanFromFields,
  getFieldsPlantingPlans,
  getFieldsHarvestingPlans,
  getFieldPlans,
  prepareSubmitPlan,
} from "./cultivation/plant/plans";
import { getHarvestCellsRect } from "./cultivation/plant/harvest";

export default {
  objects: {
    extractDBObject,
    checkEmpty,
    idToNames,
    stringifyObjectValues,
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
      getCANameFromPlantedCropVarietiesInCultivation,
      findPlantedCellCAName,
    },
    fields: {
      extractCoords,
      refreshFields,
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
  plant: {},
  plans: {
    getPlantedCropVarietesPerCultivation,
    getFieldsPlans,
    getPlansForCropVariety,
    getPlantingPlanItemId,
    getPlantingPlanFromFields,
    getFieldsPlantingPlans,
    getFieldsHarvestingPlans,
    getFieldPlans,
    prepareSubmitPlan,
  },
  harvest: {
    getHarvestCellsRect,
  },
};
