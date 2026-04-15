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

const logHbiItems = (items) => {
  items.forEach((item) => {
    console.log(
      `Crop Variety: ${item.cropVariety.name}, Batch Quantity: ${item.batchQuantity}`,
    );
    console.log(`Planted Crop Varieties: ${item.plantedCropVarieties}`);
  });
};

// you get batches, ingredients
export const getBatchesCVS = ({ harvestingBatches, product }) => {
  const batchesWithResources = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: 1,
  });
  const cvBatches = {};

  let batchesCVS = Object.fromEntries(
    harvestingBatches.map((batch) => [batch.name, null]),
  );

  for (const batch of harvestingBatches) {
    for (const ing of product.ingredients) {
      const cvName = ing.cropVariety.name;
      const batchQuantity = getBatchQuantity({ batch, cvName });
      if (!batchQuantity) {
        delete batchesCVS[batch.name];
        break;
      }
      const cvQuantPossible = {
        batchQuantity,
        possible: Math.floor(batchQuantity / ing.quantity),
      };
      if (!batchesCVS[batch.name]) {
        batchesCVS[batch.name] = {
          [cvName]: cvQuantPossible,
        };
      }
      batchesCVS[batch.name][cvName] = cvQuantPossible;
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

export const findMinPossibleBatchMap = ({ batchesCVS }) => {
  const batchMap = Object.fromEntries(
    Object.keys(batchesCVS).map((key) => [key, null]),
  );

  for (const batchName of Object.keys(batchesCVS)) {
    let min = Infinity;
    for (const cvQuantPossible of Object.values(batchesCVS[batchName])) {
      if (cvQuantPossible.possible < min) min = cvQuantPossible.possible;
    }
    batchMap[batchName] = min;
  }

  return batchMap;
};
