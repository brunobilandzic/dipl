import {  getMinValuesFromPlanted } from "./cultivationAreas.js";
import { extractCoords } from "./fields.js";

export function relativeToFieldCoords({ planted, cellCoords }) {

  const { width, length } = extractCoords(cellCoords);
  const { minX, minY } = getMinValuesFromPlanted(planted);

  return `${minX + width},${minY + length}`;
}

function checkDimension({ start, end, plantedCropVarieties }) {
  for (let y = start.length; y <= end.length; y++) {
    for (let x = start.width; x <= end.width; x++) {
      const variety = plantedCropVarieties.find(
        (variety) =>
          variety.relativeCoords === `${x},${y}` &&
          !variety.harvestedAt &&
          variety.plantedAt,
      );
      if (variety) {
        return {
          filled: true,
          variety,
        };
      }
    }
  }
  return null;
}
