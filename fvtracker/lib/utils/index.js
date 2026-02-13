import { extractDBObject } from "./objects";
import { makeUrlFriendly } from "./strings";
import { getCASCells, CAIncludesCell, getCAForCell } from "./cultivationAreas";

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
    },
  },
};
