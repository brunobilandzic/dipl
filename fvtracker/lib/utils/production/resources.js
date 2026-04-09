export const cropVarietyBatchResources = ({ harvestingBatches }) => {
  if (!harvestingBatches) return { resources: [] };
  const resources = [];
  const harvestingBatchItems = harvestingBatches.flatMap(
    (batch) => batch.harvestingBatchItems,
  );
  harvestingBatchItems.forEach((item) => {
    const cropVarietyName = item.cropVariety.name;
    const cropTypeName = item.cropVariety.cropType.name;
    const batchQuantity = item.batchQuantity;
    const existingEntry = resources.find(
      (entry) =>
        entry.cropVarietyName === cropVarietyName &&
        entry.cropTypeName === cropTypeName,
    );
    if (existingEntry) {
      existingEntry.batchQuantity += batchQuantity;
    } else {
      resources.push({
        cropVarietyName,
        cropTypeName,
        batchQuantity,
      });
    }
  });

  console.log({ resources });
  return {
    resources,
  };
};
