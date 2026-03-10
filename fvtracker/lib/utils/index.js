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
  filterCutivationCells
} from "./cultivation";
import { plCvColor, showDate } from "./display";

export default {
  objects: {
    extractDBObject,
    checkEmpty,
    idToNames
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
      filterCutivationCells
    },
  },
  formValidation: {
    numbersInRanges,
  },
  display: {
    plCvColor,
    showDate,
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
