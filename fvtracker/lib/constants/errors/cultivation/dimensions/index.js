export default {
  CULTIVATION_AREA_DIMENSIONS: (cultivationAreaDimenions) =>
    `Cultivation area dimensions must be at least ${cultivationAreaDimenions.min_ca_dim}x${cultivationAreaDimenions.min_ca_dim} and at most ${cultivationAreaDimenions.max_ca_dim}x${cultivationAreaDimenions.max_ca_dim}`,
  CULTIVATION_AREA_OVERLAP: "Cultivation areas cannot overlap",
  CULTIVATION_AREA_GAP: (gap) => `Cultivation areas must have a gap of at least ${gap} cells between them`,
};
