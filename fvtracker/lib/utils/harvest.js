export const getHarvestRect = ({
  beginX,
  beginY,
  endX,
  endY,
  cultivationCells,
  cropVarietyId,
}) => {
  const rect = [];

  const minX = Math.min(beginX, endX);
  const maxX = Math.max(beginX, endX);
  const minY = Math.min(beginY, endY);
  const maxY = Math.max(beginY, endY);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const cellCoord = `${x},${y}`;
      const cell = cultivationCells.find((c) => c.relativeCoords === cellCoord);
      const cellCropVarietyId = cell?.plantedCropVariety?.cropVariety?._id;
      if (cell && cellCropVarietyId === cropVarietyId) {
        rect.push(cellCoord);
      }
    }
  }

  return rect;
};
