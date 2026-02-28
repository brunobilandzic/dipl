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

export function getPlCvs(cultivations) {
  const plCvs = [];

  cultivations.forEach((cultivation) => {
    cultivation.plantedCropVarieties.forEach((pcv) => {
      if (pcv.relativeCoords) {
        plCvs.push(pcv);
      } 
    });
  });

  return plCvs;
}

export function relativeToFieldCoords({ planted, cellCoords }) {
  const { width, length } = extractCoords(cellCoords);
  const { minX, minY } = getMinValuesFromPlanted(planted);

  return `${minX + width},${minY + length}`;
}

export const mapCells = ({ planted, cellCoords }) => {
  return cellCoords.map((cell) => {
    const fieldCell = utils.cultivation.cultivations.relativeToFieldCoords({
      planted: planted,
      cellCoords: cell,
    });
    return {
      relativeCoords: cell,
      fieldCoords: fieldCell,
    };
  });
};

export const prepareCultivationData = (newCultivation) => {
  const cultivationData = {
    cultivationAreaId: newCultivation.cultivationAreaId,
    name: newCultivation.name,
    description: newCultivation.description,
    relativeCoords: newCultivation.potentialCUCells,
    cropVarietyId: newCultivation.cropVarietyId,
    existingCulName = newCultivation.existingCulName
  };
  return cultivationData;
};
