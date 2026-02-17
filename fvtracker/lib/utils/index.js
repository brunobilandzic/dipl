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
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
