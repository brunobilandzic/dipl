export default {
  CULTIVATION_AREA_DIMENSIONS: (cultivationAreaDimenions) =>
    `Dimenzije površine uzgoja moraju biti najmanje ${cultivationAreaDimenions.min_ca_dim}x${cultivationAreaDimenions.min_ca_dim} i najviše ${cultivationAreaDimenions.max_ca_dim}x${cultivationAreaDimenions.max_ca_dim}`,
  CULTIVATION_AREA_OVERLAP: "Površine uzgoja ne smiju se preklapati",
  CULTIVATION_AREA_GAP: (gap) =>
    `Površine uzgoja moraju imati razmak od najmanje ${gap} ćelija između njih`,
  CULTIVATION_OVERLAP: "Uzgoji se ne smiju preklapati",
  PLANT_OVERLAP: "Sadnje se ne smiju preklapati",
};
