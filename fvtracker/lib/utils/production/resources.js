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
    console.log({ batchName, batchResources });
    return batchResources;
  });

  console.log({ batchesResources });
  return {
    batchesResources,
  };
};

export const getBatchesWithResources = ({
  harvestingBatches,
  product,
  quantity,
}) => {
  if (!harvestingBatches) return null;
  let batches = [];
  const varietiesQuantities = extractVarietiesQuantities({ product, quantity });

  for (const harvestingBatch of harvestingBatches) {
    let hasResources = true;
    for (const [cropVarietyName, requiredQuantity] of Object.entries(
      varietiesQuantities,
    )) {
      const item = harvestingBatch.harvestingBatchItems.find(
        (hbi) =>
          hbi.cropVariety.name === cropVarietyName &&
          hbi.batchQuantity >= requiredQuantity,
      );
      if (!item) {
        hasResources = false;
        break;
      }
    }
    if (hasResources) {
      batches.push(harvestingBatch);
    }
  }
  return batches;
};

// you get batches, ingredients
export const productPossibleStocksNum = ({ harvestingBatches, product }) => {
  const batchesWithResources = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: 1,
  });
  const batchCVS = {};
  for (const ing of product.ingredients) {
    const cvName = ing.cropVariety.name;
    batchCVS[cvName] = calculateCropVarietyAmout({
      batches: harvestingBatches,
      cvName,
    });
  }
  console.log({ batchCVS });
};

const calculateCropVarietyAmout = ({ batches, cvName }) => {
  const cvBatches = batches.reduce((batchesCvQuantity, batch) => {
    const batchQuantity = batch.harvestingBatchItems.find(
      (hbi) => hbi.cropVariety.name == cvName,
    ).batchQuantity;
    batchesCvQuantity[batch.name] = batchQuantity;
    return batchesCvQuantity;
  }, {});
  console.log({ cvBatches });
  return cvBatches;
};
