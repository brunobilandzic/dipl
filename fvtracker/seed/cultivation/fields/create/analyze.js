function max_dim(ca, dim) {
  const plantedCells = Array.from(ca.planted || []);
  return plantedCells.reduce((max, plantedCell) => {
    const cellCoordinates = plantedCell[0]?.split(",").map(Number) ?? [0, 0];
    const cellDim = cellCoordinates[dim === "row" ? 0 : 1] || 0;
    return cellDim > max ? cellDim : max;
  }, 0);
}

function min_dim(ca, dim) {
  const plantedCells = Array.from(ca.planted || []);
  return plantedCells.reduce((min, plantedCell) => {
    const cellCoordinates = plantedCell[0]?.split(",").map(Number) ?? [0, 0];
    const cellDim = cellCoordinates[dim === "row" ? 0 : 1] || 0;
    return cellDim < min ? cellDim : min;
  }, Infinity);
}

function get_ca_min_max(ca) {
  if (ca.length === 0) {
    return { ca_max_y: 0, ca_min_x: 0, ca_max_x: 0, ca_min_y: 0 };
  }
  const ca_min_x = min_dim(ca, "row");
  const ca_max_x = max_dim(ca, "row");
  const ca_max_y = max_dim(ca, "col");
  const ca_min_y = min_dim(ca, "col");
  return { ca_min_x, ca_max_x, ca_min_y, ca_max_y };
}

function drawField(field) {
  console.log(allCoordinates(field));
  let { width, length, cultivationAreas } = field;
  const plantedCells =
    cultivationAreas?.reduce((acc, ca) => {
      const plantedArray = Array.from(ca.planted || []);
      const plantedCells = plantedArray.map((plantedCell) => plantedCell[0]);
      return acc.concat(plantedCells);
    }, []) || [];
  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        plantedCells.some((plantedCell) => {
          const [cellX, cellY] = plantedCell.split(",").map(Number);
          return cellX === x && cellY === y;
        })
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log(
    "\n\nCultivation areas has",
    cultivationAreas.length,
    "cultivation areas.",
  );
  printFieldParams(field);
}

function sum_points({ width, length }) {
  return width * length;
}

function fieldCultivationAreaPoints(field) {
  const plantedCellsMapArray =
    field.cultivationAreas?.map((ca) => ca.planted) || [];
  return plantedCellsMapArray.reduce(function (sum, plantedCellsMap) {
    return sum + Array.from(plantedCellsMap || []).length;
  }, 0);
}

function allCoordinates(field) {
  const ca_coordinates = {};
  for (let i = 0; i < field.cultivationAreas.length; i++) {
    const ca = field.cultivationAreas[i];
    const dimensions = get_ca_min_max(ca);
    ca_coordinates[`cultivation area ${i}`] = dimensions;
  }

  return ca_coordinates;
}

function fieldFilledRatio(field) {
  const fieldPoints = sum_points(field.dimensions);
  const caPoints = fieldCultivationAreaPoints(field);
  const ratio = caPoints / fieldPoints;
  return ratio;
}

function printFieldParams(field) {
  const { cultivationAreas, ...loggableField } = field;
  console.log(
    "field params:",
    loggableField,
    "\ncultivationAreas count:",
    cultivationAreas.length,
  );
  const {
    name,
    ratio,
    dimensions: { width, length },
    cultivationAreaDimensions: { min_ca_dim, max_ca_dim, gap },
  } = field;
  console.log(
    `Field ${name} has dimensions ${width}x${length}, min CA dim ${min_ca_dim}, max CA dim ${max_ca_dim}, created ${cultivationAreas.length} cultivation areas and filled ratio ${fieldFilledRatio(field)}.`,
  );
}

export {
  drawField,
  get_ca_min_max,
  fieldFilledRatio,
  printFieldParams,
  allCoordinates,
  sum_points,
  fieldCultivationAreaPoints,
};
