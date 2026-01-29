import {
  fieldExample,
  get_ca_min_max,
  length_options,
  max_ca_dim,
  min_ca_dim,
} from "./constants.js";
import { checkFieldEnd } from "./seed_point.js";

function allCoordinates(field) {
  const ca_coordinates = {};
  for (let i = 0; i < field.cultivationAreas.length; i++) {
    const ca = field.cultivationAreas[i];
    const dimensions = get_ca_min_max(ca);
    ca_coordinates[`cultivation area ${i}`] = dimensions;
  }

  console.log("CA coordinates:", ca_coordinates);
  return ca_coordinates;
}

function randomPoint(field) {
  const { f_width, f_length, cultivationAreas } = field;

  let x = Math.floor(Math.random() * f_width) + 1;
  let y = Math.floor(Math.random() * f_length) + 1;
  let dim_x = length_options[Math.floor(Math.random() * length_options.length)];
  let dim_y = length_options[Math.floor(Math.random() * length_options.length)];

  return { x, y, dim_x, dim_y };
}

function coveringArea(field, x, y, dim_x, dim_y) {
  const { cultivationAreas } = field;

  for (let ca of cultivationAreas) {
    const ca_dimensions = get_ca_min_max(ca);
    if (
      x >= ca_dimensions.ca_min_x &&
      x + dim_x <= ca_dimensions.ca_max_x &&
      y >= ca_dimensions.ca_min_y &&
      y + dim_y <= ca_dimensions.ca_max_y
    ) {
      return true;
    }
  }
  return false;
}

function tryAI(field, can) {
  console.log("Attempts remaining:", can);
  const { f_width, f_length, cultivationAreas } = field;
  if (can <= 0) {
    console.log("Maximum attempts reached. Stopping seeding process.");
    drawGridPlainer(field);
    return field;
  }
  if (checkFieldEnd(field)) {
    console.log("Field is properly seeded to the end.");
    return field;
  }

  let { x, y, dim_x, dim_y } = randomPoint(field);
  while (
    coveringArea(field, x, y, dim_x, dim_y) ||
    x + dim_x > f_width ||
    y + dim_y > f_length
  ) {
    ({ x, y, dim_x, dim_y } = randomPoint(field));
  }
  const ca = [];
  for (let xi = x; xi < x + dim_x; xi++) {
    for (let yi = y; yi < y + dim_y; yi++) {
      ca.push({ row: xi, col: yi });
    }
  }
  field.cultivationAreas.push(ca);
  console.log(
    `Added cultivation area at (${x}, ${y}) with dimensions (${dim_x} x ${dim_y})`,
  );
  return tryAI(field, can - 1);
}

const field = tryAI(fieldExample, 5);

function drawGridPlainer(field) {
  const { f_width: width, f_length: length, cultivationAreas } = field;
  console.log("drawing grid:");

  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some((ca) => {
          return ca.some((cell) => {
            return cell.row === x && cell.col === y;
          });
        })
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "rows.");
  cultivationAreas.forEach(function (caRow, rowIndex) {
    console.log(
      `Cultivation Area Row ${rowIndex + 1} has ${caRow.length} cultivation areas:`,
    );
  });
}
