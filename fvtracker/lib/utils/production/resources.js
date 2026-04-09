export const cropVarietyBatchResources = ({ harvestingBatches }) => {
  if (!harvestingBatches) return { resources: [] };
  const batchesResources = [];
  const resources = harvestingBatches.map((batch) => {
    const batchName = batch.name;
    const batchResources = batch.harvestingBatchItems.forEach((item) => {
      const cropVarietyName = item.cropVariety.name;
      const cropTypeName = item.cropVariety.cropType.name;
      const batchQuantity = item.batchQuantity;
      batchesResources.push({
        batchName,
        cropVarietyName,
        cropTypeName,
        batchQuantity,
      });
    });
    return batchResources;
  });

  console.log({ batchesResources });
  return {
    batchesResources,
  };
};
