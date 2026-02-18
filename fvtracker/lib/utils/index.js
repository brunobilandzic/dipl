import { extractDBObject } from "./objects";
import { makeUrlFriendly, dimensionsString  } from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  getCellsInRect,
  getDimensionsForNewCA,
  getDimensionsFromPlanted,
  plantedArrayToMap,
  prepareCulitvationArea
} from "./cultivationAreas";
import { numberInRange } from "./formValidation";

export default {
  objects: {
    extractDBObject,
  },
  strings: {
    makeUrlFriendly,
    dimensionsString
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
      prepareCulitvationArea
    },
  },
  formValidation: {
    numberInRange,
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
