import { extractDBObject, checkEmpty } from "./objects";
import {
  makeUrlFriendly,
  dimensionsString,
  alphanumericOnly,
  sanitize,
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
  adjacentCellsGap
} from "./cultivationAreas";
import { numbersInRanges } from "./formValidation";
import { getCropDimensions } from "./crops";

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
      adjacentCellsGap
    },
  },
  formValidation: {
    numbersInRanges,
  },
  crops: {
    dimensions: getCropDimensions
  }
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
