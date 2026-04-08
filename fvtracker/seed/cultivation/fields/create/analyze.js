import { extractCoords } from "@/lib/utils/cultivation/fields/fields";

function max_dim(planted, dim) {
  return planted.reduce((max, cell) => {
    const cellCoordinates = extractCoords(cell);
    const cellDim = cellCoordinates[dim === "width" ? "width" : "length"] || 0;
    return cellDim > max ? cellDim : max;
  }, 0);
}

function min_dim(planted, dim) {
  return planted.reduce((min, cell) => {
    const cellCoordinates = extractCoords(cell);
    const cellDim = cellCoordinates[dim === "width" ? "width" : "length"] || 0;
    return cellDim < min ? cellDim : min;
  }, Infinity);
}

function get_ca_min_max(planted) {
  if (planted.length === 0) {
    return { ca_max_y: 0, ca_min_x: 0, ca_max_x: 0, ca_min_y: 0 };
  }
  const ca_min_x = min_dim(planted, "width");
  const ca_max_x = max_dim(planted, "width");
  const ca_max_y = max_dim(planted, "length");
  const ca_min_y = min_dim(planted, "length");
  return { ca_min_x, ca_max_x, ca_min_y, ca_max_y };
}

function drawField(field) {
  console.log(allCoordinates(field));
  let { dimensions, cultivationAreas } = field;
  const { width, length } = dimensions;
  const plantedCells =
    cultivationAreas?.reduce((acc, ca) => {
      return acc.concat(ca.planted);
    }, []) || [];
  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (plantedCells.some((plantedCell) => plantedCell === `${x},${y}`)) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("\n\nField has", cultivationAreas.length, "cultivation areas.");
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
    const dimensions = get_ca_min_max(ca.planted);
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
