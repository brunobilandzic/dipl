import { extractDBObject } from "./objects";
import { makeUrlFriendly } from "./strings";
import {
  getCASCells,
  CAIncludesCell,
  getCAForCell,
  mapCANamesToPlantedCells,
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
      mapCANamesToPlantedCells,
    },
  },
};
