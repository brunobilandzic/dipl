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
  console.log("analyzing resources for", product.name);
  const batchesWithResources = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: 1,
  });
  const cvBatches = {};

  let batchesCVS = Object.fromEntries(
    harvestingBatches.map((batch) => [batch.name, null]),
  );

  console.log({ batchesCVS });
  for (const batch of harvestingBatches) {
    for (const ing of product.ingredients) {
      const cvName = ing.cropVariety.name;
      console.log("looking for", cvName);
      const batchQuantity = getBatchQuantity({ batch, cvName });
      if (!batchQuantity) {
        delete batchesCVS[batch.name];
        break;
      }
      if (!batchesCVS[batch.name]) {
        batchesCVS[batch.name] = {
          [cvName]: batchQuantity,
        };
      }
      batchesCVS[batch.name][cvName] = batchQuantity;
    }
  }

  return batchesCVS;
};

/* 

const calculateCropVarietyAmouts = ({ batches, cvNames, needed }) => {
  let cvBatches = batches.reduce((batchesCvQuantity, batch) => {
    const batchQuantity = getBatchQuantity({ batch, cvNames });
    if (!batchQuantity) {
      const { [batch.name]: _, ...rest } = batchesCvQuantity;
      return rest;
    }
    batchesCvQuantity[batch.name] = {
      batchQuantity,
      possible: Math.floor(batchQuantity / needed),
    };
    return batchesCvQuantity;
  }, {});
  console.log("cvbatches", cvBatches);

  return cvBatches;
}; */

const getBatchQuantity = ({ batch, cvName }) => {
  return batch.harvestingBatchItems.find(
    (hbi) => hbi.cropVariety.name == cvName,
  )?.batchQuantity;
};
