import { extractDBObject } from "./objects";
import { makeUrlFriendly } from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  getCellsInRect,
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
    },
  },
};

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
