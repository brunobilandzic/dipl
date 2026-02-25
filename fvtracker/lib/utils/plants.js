import { extractPlantedCells, getMinValuesFromPlanted } from "./cultivationAreas.js";

export function relativeToFieldCoords({ planted, cellCoords }) {

  const { width, length } = extractCoords(cellCoords);
  const { minX, minY } = getMinValuesFromPlanted(planted);

  return `${minX + width},${minY + length}`;
}

}
