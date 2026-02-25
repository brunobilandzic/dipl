import { extractDBObject, checkEmpty } from "./objects";
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
import { getCultivationDimensions, relativeToFieldCoords } from "./plants";
import { extractCoords } from "./fields";

export default {
  objects: {
    extractDBObject,
    checkEmpty,
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
    },
    plants: {
      relativeToFieldCoords,
    },
    fields: {
      extractCoords,
    },
  },
  formValidation: {
    numbersInRanges,
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
