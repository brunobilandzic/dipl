import { extractVarietiesQuantities } from "./products";

export const cropVarietyBatchResources = ({ harvestingBatches }) => {
  if (!harvestingBatches) return { resources: [] };
  const batchesResources = [];
  const resources = harvestingBatches.map((batch) => {
    const batchName = batch.name;
    const batchResources = batch.harvestingBatchItems.forEach((item) => {
      const batchResource = {
        cropVariety: `${item.cropVariety.cropType.name} ${item.cropVariety.name}`,
        batchQuantity: item.batchQuantity,
        quality: item.quality,
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
  const varietiesQuantitiesQualities = extractVarietiesQuantities({
    product,
    quantity,
  });
  // varijabla varietiesQuantitiesQualities je objekat koji sadrži cropVarietyName kao ključ, a vrednost je objekat sa quantity i quality
  for (const harvestingBatch of harvestingBatches) {
    let hasResources = true;
    for (const [
      cropVarietyName,
      { quantity: requiredQuantity, quality: requiredQuality },
    ] of Object.entries(varietiesQuantitiesQualities)) {
      const item = harvestingBatch.harvestingBatchItems.find(
        (hbi) =>
          hbi.cropVariety.name === cropVarietyName &&
          hbi.batchQuantity >= requiredQuantity &&
          hbi.quality === requiredQuality,
      );

      if (!item) {
        // ukoliko ne postoji odgovarajuća stavka u žetvi, žetva se ne može koristiti za proizvodnju
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
export const getBatchesCVS = ({ harvestingBatches, product }) => {
  let batchesCVS = Object.fromEntries(
    harvestingBatches.map((batch) => [batch.name, null]),
  );

  for (const batch of harvestingBatches) {
    for (const ing of product.ingredients) {
      const cvName = ing.cropVariety.name;
      const batchQuantity = getBatchQuantity({
        batch,
        cvName,
        quality: ing.quality,
      });
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

const getBatchQuantity = ({ batch, cvName, quality }) => {
  return batch.harvestingBatchItems.find(
    (hbi) => hbi.cropVariety.name == cvName && hbi.quality == quality,
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
