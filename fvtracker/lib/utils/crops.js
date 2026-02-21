export function getCropDimensions({
  planted
}) {

  const emptySlots = [];

  for (const [slot, cropVarietyId] of planted) {
    if (!cropVarietyId) {
      emptySlots.push(slot);
    }
  }

  console.log(`There are ${emptySlots.length} empty slots in the cultivation area.`);
}