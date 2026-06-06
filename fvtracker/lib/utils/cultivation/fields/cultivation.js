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
        plCvs.push({
          ...pcv,
          cultivationName: cultivation.name,
          cultivation: cultivation._id,
        });
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
    existingCulName: newCultivation.existingCulName,
  };
  return cultivationData;
};

export function getCUForCell(cultivations, cellCoords) {
  for (const cultivation of cultivations) {
    for (const pcv of cultivation.plantedCropVarieties) {
      if (pcv.relativeCoords === cellCoords) {
        return cultivation;
      }
    }
  }
  return null;
}

export function getCultivationNameForCell({
  cultivationCells,
  cell,
  fieldView = true,
}) {
  const cultivationCell = cultivationCells.find((cc) => {
    if (fieldView) {
      return cc.fieldCoords === cell;
    } else {
      return cc.relativeCoords === cell;
    }
  });
  return cultivationCell ? cultivationCell.cultivationName : null;
}

export const getCASCultivations = (cultivationAreas) => {
  return cultivationAreas.reduce((acc, ca) => {
    return acc.concat(ca.cultivations);
  }, []);
};

export const filterCutivationCells = ({ cultivationCells, cultivationId }) => {
  return cultivationCells.filter((cc) => cc.cultivation === cultivationId);
};

export const getFieldCultivations = (field) => {
  const cultivations = [];

  field.cultivationAreas.forEach((ca) => {
    ca.cultivations.forEach((cul) => {
      cultivations.push(cul);
    });
  });

  if (cultivations.length === 0) {
    throw new Error("No cultivations found for this field");
  }

  return cultivations;
};

export const fieldHasCultivations = (field) => {
  return field.cultivationAreas.some((ca) => ca.cultivations.length > 0);
};

export const getCultivationCount = (cultivationAreas) =>
  cultivationAreas?.reduce((count, ca) => count + ca.cultivations?.length, 0);

export const getCultivationsArea = (cultivations) =>
  cultivations.reduce(
    (totalArea, cul) => totalArea + cul.plantedCropVarieties.length,
    0,
  );

export const flatFieldsCultivations = (fields) => {
  const cultivations = [];

  fields.forEach((field) => {
    field.cultivationAreas.forEach((ca) => {
      ca.cultivations.forEach((cul) => {
        cultivations.push(cul);
      });
    });
  });

  return cultivations;
};
