import api from "@/lib/api";

export const getHarvestCellsRect = ({
  beginX,
  beginY,
  endX,
  endY,
  cultivationCells,
  cropVarietyId,
}) => {
  const rectCells = [];

  const minX = Math.min(beginX, endX);
  const maxX = Math.max(beginX, endX);
  const minY = Math.min(beginY, endY);
  const maxY = Math.max(beginY, endY);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const cellCoord = `${x},${y}`;
      const cell = cultivationCells.find((c) => c.relativeCoords === cellCoord);
      const cellCropVarietyId =
        cell?.plantingPlanItem?.cropVariety?._id?.toString();
      if (cell && cellCropVarietyId === cropVarietyId) {
        rectCells.push(cellCoord);
      }
    }
  }

  return rectCells;
};

export const harvestingBatchesFields = ({ fields }) => {
  const batches = {};

  for (const field of fields) {
    batches[field.name] = {};
  }

  for (const key of Object.keys(batches)) {
    const field = fields.find((f) => f.name === key);
    batches[key] = field.harvestingPlans.reduce((acc, hp) => {
      acc[hp.name] = hp.harvestingBatch;
      return acc;
    }, batches[key]);
  }

  return batches;
};
