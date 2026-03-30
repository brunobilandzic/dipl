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

export async function refreshHarvestingBatches({ dispatch, router }) {
  try {
    const res = await api.get("/cultivation/harvest/batches");
    if(res.data && res.data.harvestingBatches && Array.isArray(res.data.harvestingBatches)) {
      dispatch(setHarvestingBatches(res.data.harvestingBatches));
    }
  } catch (error) {
    handleError({
      ...error,
      generalMessage: "Došlo je do greške prilikom učitavanja serpantina.",
    });
  }
}
