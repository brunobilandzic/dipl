import { extractPlantedCells, getMinValuesFromPlanted } from "./cultivationAreas.js";

export function getCropDimensions({ planted, width, length }) {
  const emptySlots = [];
  const plantedCells = extractPlantedCells(planted);

  for (const [slot, cropVarietyId] of planted) {
    if (!cropVarietyId) {
      emptySlots.push(slot);
    }
  }

  console.log(
    `There are ${emptySlots.length} empty slots in the cultivation area.`,
  );

  const emptyDimensions = [];

  emptySlots.map((slot) => {
    const [x, y] = slot.split(",").map(Number);
    const adjacentCells = utils.cultivation.cultivationAreas.getAdjacentCells(
      x,
      y,
      planted,
    );
  });
}

export function cultivationAreaMapCoords({ planted, cellCoords }) {
  const plantedCells = extractPlantedCells(planted);

  const [x, y] = cellCoords.split(",").map(Number);
  const { minX, minY } = getMinValuesFromPlanted(plantedCells);

  return `${minX + x},${minY + y}`;
}
