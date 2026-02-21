import { extractPlantedCells } from "./cultivationAreas.js";

export function getCropDimensions({ planted, width, length }) {
  const emptySlots = [];
  const plantedCells = extractPlantedCells(planted);
    console.log("pc:", plantedCells.length)

  for (const [slot, cropVarietyId] of planted) {
    if (!cropVarietyId) {
      emptySlots.push(slot);
    }
  }

  console.log(`There are ${emptySlots.length} empty slots in the cultivation area.`);
}