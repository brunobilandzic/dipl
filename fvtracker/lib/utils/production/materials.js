export const materialsList = ({ materials }) => {
  const harvestingBatchItems = materials.flatMap(
    (material) => material.harvestingBatchItems,
  );
  console.log({ harvestingBatchItems });
};
