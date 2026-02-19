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
  getDimensionsForNewCA,
  getDimensionsFromPlanted,
  plantedArrayToMap,
  prepareCulitvationArea,
} from "./cultivationAreas";
import { numbersInRanges } from "./formValidation";

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
      getDimensionsForNewCA,
      getDimensionsFromPlanted,
      plantedArrayToMap,
      prepareCulitvationArea,
    },
  },
  formValidation: {
    numbersInRanges,
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
