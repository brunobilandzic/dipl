import { extractDBObject } from "./objects";
import { makeUrlFriendly } from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  getCellsInRect,
  getDimensionsForNewCA
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
      getDimensionsForNewCA
    },
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
