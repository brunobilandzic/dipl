import { numberOfCultivations } from "@/seed/data/cultivations.js";


export async function createCultivations({ planted, plantedCropVarieties }) {
  // create cultivations in ca
  const { width, length } = getDimensionsFromPlanted(planted);
  const { fields, cropData } = await cultivation.plants.fieldCropData();
  const cultNum = numberOfCultivations({width, length});

  console.log("createing", cultNum, "cultivations")
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
