export const harvestingBatchItemData = ({ batchItem }) => {
  const quantityPerCell = batchItem.cropVariety?.quantityPerCell || 0;

  const cropVarietyName = batchItem.cropVariety?.name || "N/A";
  const plcvCount = batchItem.plantedCropVarieties?.length || 0;
  const quantity = quantityPerCell * plcvCount;
  return { quantity, cropVarietyName, plcvCount };
};