export const cropVarietyBatchQuantities = ({ materials }) => {
  const cropVarietyBatchQuantities = [];
  const harvestingBatchItems = materials.flatMap(
    (material) => material.harvestingBatchItems,
  );
  harvestingBatchItems.forEach((item) => {
    const cropVarietyName = item.cropVariety.name;
    const cropTypeName = item.cropVariety.cropType.name;
    const batchQuantity = item.batchQuantity;
    const existingEntry = cropVarietyBatchQuantities.find(
      (entry) =>
        entry.cropVarietyName === cropVarietyName &&
        entry.cropTypeName === cropTypeName,
    );
    if (existingEntry) {
      existingEntry.batchQuantity += batchQuantity;
    } else {
      cropVarietyBatchQuantities.push({
        cropVarietyName,
        cropTypeName,
        batchQuantity,
      });
    }
  });

  console.log({ cropVarietyBatchQuantities });
};
