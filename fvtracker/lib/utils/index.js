import { extractDBObject } from "./objects";
import { makeUrlFriendly } from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  getCellsInRect,
  getDimensionsForNewCA,
  getDimensionsFromPlanted,
  plantedArrayToMap
} from "./cultivationAreas";

export default {
  objects: {
    extractDBObject,
  },
  strings: {
    makeUrlFriendly,
  },
  cultivation: {
    cultivationAreas: {
      getCASCells,
      CAIncludesCell,
      getCAForCell,
      getCellsInRect,
      getDimensionsForNewCA,
      getDimensionsFromPlanted,
      plantedArrayToMap
    },
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
