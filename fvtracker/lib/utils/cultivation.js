import { getMinValuesFromPlanted } from "./cultivationAreas.js";
import { extractCoords } from "./fields.js";

export function getCUSCells(cultivations) {
    const cells = [];

    cultivations.forEach((cultivation) => {
        cultivation.plantedCropVarieties.forEach((pcv) => {
            if (pcv.relativeCoords) {
                cells.push(pcv.relativeCoords);
            }
        });
    });

    return cells;
}



export function relativeToFieldCoords({ planted, cellCoords }) {
  const { width, length } = extractCoords(cellCoords);
  const { minX, minY } = getMinValuesFromPlanted(planted);

  return `${minX + width},${minY + length}`;
}