export const cropVarietyBatchResources = ({ harvestingBatches }) => {
  if (!harvestingBatches) return { resources: [] };
  const batchesResources = [];
  const resources = harvestingBatches.map((batch) => {
    const batchName = batch.name;
    const batchResources = batch.harvestingBatchItems.forEach((item) => {
      const batchResource = {
        cropVarietyName: item.cropVariety.name,
        cropTypeName: item.cropVariety.cropType.name,
        batchQuantity: item.batchQuantity,
      };

      const existingBatchResource = batchesResources.find(
        (br) => br.batchName === batchName,
      );
      if (existingBatchResource) {
        existingBatchResource.resources.push(batchResource);
        return;
      }
      batchesResources.push({
        batchName,
        resources: [batchResource],
      });
    });
    return batchResources;
  });

  console.log({ batchesResources });
  return {
    batchesResources,
  };
};


export const getBatchWithResources = ({
  harvestingBatches,
  cropVaietyIds,
  requiredQuantity,
}) => {
  if (!harvestingBatches) return null;
  for (const batch of harvestingBatches) {
    const hasResources = false
    for (const item of batch.harvestingBatchItems) {
      if(cropVaietyIds.includes(item.cropVariety._id.toString()) && item.batchQuantity >= requiredQuantity) {
        continue