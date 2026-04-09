import { extractVarietiesQuantities } from "./products";

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
  product,
  quantity,
}) => {
  if (!harvestingBatches) return null;
  let batch = null;
  const varietiesQuantities = extractVarietiesQuantities({ product, quantity });

  for (const harvestingBatch of harvestingBatches) {
    const hasResources = true;
    for (const item of harvestingBatch.harvestingBatchItems) {
      const requiredQuantity = varietiesQuantities[item.cropVarietyId];
      if (!requiredQuantity || item.batchQuantity < requiredQuantity) {
        hasResources = false;
        break;
      }
      if (hasResources) {
        batch = harvestingBatch;
        break;
      }
    }
  }
};
