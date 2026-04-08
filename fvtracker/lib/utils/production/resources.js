export const cropVarietyBatchResources = ({ materials }) => {
  if (!materials) return { resources: [] };
  const resources = [];
  const harvestingBatchItems = materials.flatMap(
    (material) => material.harvestingBatchItems,
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
