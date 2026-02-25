import { getMinValuesFromPlanted } from "./cultivationAreas.js";
import { extractCoords } from "./fields.js";

export function relativeToFieldCoords({ planted, cellCoords }) {
  const { width, length } = extractCoords(cellCoords);
  const { minX, minY } = getMinValuesFromPlanted(planted);

  return `${minX + width},${minY + length}`;
}