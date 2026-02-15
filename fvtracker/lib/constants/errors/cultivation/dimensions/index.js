export default {
  CULTIVATION_AREA_DIMENSIONS: (cultivationAreaDimenions) =>
    `Cultivation area dimensions must be at least ${cultivationAreaDimenions.min_ca_dim}x${cultivationAreaDimenions.min_ca_dim} and at most ${cultivationAreaDimenions.max_ca_dim}x${cultivationAreaDimenions.max_ca_dim}`,
  CULTIVATION_AREA_OVERLAP: "Cultivation areas cannot overlap",
};
