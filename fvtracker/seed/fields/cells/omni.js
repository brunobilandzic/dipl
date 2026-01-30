import {
  get_ca_min_max,
  gap,
} from "./constants.js";
import { checkFieldEnd, satisfaction } from "./seed_point.js";

function allCoordinates(field) {
  const ca_coordinates = {};
  for (let i = 0; i < field.cultivationAreas.length; i++) {
    const ca = field.cultivationAreas[i];
    const dimensions = get_ca_min_max(ca);
    ca_coordinates[`cultivation area ${i}`] = dimensions;
  }

  return ca_coordinates;
}

function randomPoint(field) {
  const { width, length, min_ca_dim, max_ca_dim, gap } = field;

  const length_options = [];
  for (let i = min_ca_dim; i <= max_ca_dim; i++) {
    length_options.push(i);
  }

  let x = Math.floor(Math.random() * width) + 1;
  let y = Math.floor(Math.random() * length) + 1;
  let dim_x = length_options[Math.floor(Math.random() * length_options.length)];
  let dim_y = length_options[Math.floor(Math.random() * length_options.length)];

  return { x, y, dim_x, dim_y };
}

function notValidPoint(field, x, y, dim_x, dim_y, ) {
  const { width, length, cultivationAreas } = field;

  if (x < 0 || y < 0 || x + dim_x > width || y + dim_y > length) {
    return true;
  }

  for (let xi = x; xi <= x + dim_x + gap; xi++) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let ca of cultivationAreas) {
        for (let point of ca) {
          if (point.row === xi && point.col === yi) {
            return true;
          }
        }
      }
    }
    for (let yi = y; yi >= y - gap; yi--) {
      for (let ca of cultivationAreas) {
        for (let point of ca) {
          if (point.row === xi && point.col === yi) {
            return true;
          }
        }
      }
    }
  }

  for (let xi = x; xi >= x - gap; xi--) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let ca of cultivationAreas) {
        for (let point of ca) {
          if (point.row === xi && point.col === yi) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function createField(fieldParams) {
  const msStart = Date.now();

  const {width, length, min_ca_dim, max_ca_dim} = fieldParams;

  const field = {
    width: width,
    length: length,
    cultivationAreas: [],
  };

  function tryAITime(field) {
    const { width, length } = field;
    if (satisfaction(field)) {
      console.log("Field is properly seeded to the end.");
      return field;
    }

    let { x, y, dim_x, dim_y } = randomPoint(field);

    let reasonableAttempts = 0;
    while (
      notValidPoint(field, x, y, dim_x, dim_y) ||
      x + dim_x + gap > width ||
      y + dim_y + gap > length
    ) {
      const loopTime = Date.now();
      ({ x, y, dim_x, dim_y } = randomPoint(field));
      if (loopTime - msStart > msWindow) {
        console.log("Time window exceeded, stopping field creation.", loopTime - msStart);
        return field;
      }

    }
    const ca = [];

    for (let xi = x; xi < x + dim_x; xi++) {
      for (let yi = y; yi < y + dim_y; yi++) {
        ca.push({ row: xi, col: yi });
      }
    }
    field.cultivationAreas.push(ca);
    return tryAITime(field);
  }

  let fieldResult = tryAITime(field);
  const msEnd = Date.now();
  drawGridPlainer(fieldResult);
  return fieldResult;
}

createField(100, 100);

function trcsdacdyAITime(field, ms) {
  const { width, length } = field;
  if (satisfaction(field)) {
    console.log("Field is properly seeded to the end.");
    return field;
  }

  let { x, y, dim_x, dim_y } = randomPoint(field);

  let reasonableAttempts = 0;
  while (
    coveringArea(field, x, y, dim_x, dim_y) ||
    x + dim_x > width ||
    y + dim_y > length
  ) {
    reasonableAttempts += 1;
    if (reasonableAttempts > 10000) {
      drawGridPlainer(field);
      return field;
    }

    ({ x, y, dim_x, dim_y } = randomPoint(field));
    /*     if (reasonableAttempts > 500) {
      console.log("Could not find a suitable position after 50 attempts.");
      drawGridPlainer(field);
      return field;
    } */
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
  return tryAI(field);
}

function tryAI(field) {
  const { f_width, f_length } = field;
  if (satisfaction(field)) {
    console.log("Field is properly seeded to the end.");
    return field;
  }

  let { x, y, dim_x, dim_y } = randomPoint(field);

  let reasonableAttempts = 0;
  while (
    coveringArea(field, x, y, dim_x, dim_y) ||
    x + dim_x > f_width ||
    y + dim_y > f_length
  ) {
    reasonableAttempts += 1;
    if (reasonableAttempts > 10000) {
      drawGridPlainer(field);
      return field;
    }

    ({ x, y, dim_x, dim_y } = randomPoint(field));
    /*     if (reasonableAttempts > 500) {
      console.log("Could not find a suitable position after 50 attempts.");
      drawGridPlainer(field);
      return field;
    } */
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
  return tryAI(field);
}

// const field = tryAI(fieldExample);

function drawGridPlainer(field) {
  const { width, length, cultivationAreas } = field;
  console.log(
    "field count:",
    cultivationAreas.reduce((length, ca) => length + ca.length, 0),
  );

  console.log("drawing grid:");
  for (let y = 0; y < length; y++) {
    let rowStr = "";
    for (let x = 0; x < width; x++) {
      if (
        cultivationAreas.some((ca) =>
          ca.some((point) => point.row === x && point.col === y),
        )
      ) {
        rowStr += "+";
      } else {
        rowStr += "-";
      }
    }
    console.log(rowStr);
  }
  console.log("Cultivation areas has", cultivationAreas.length, "c.");
  console.log("Satisfaction:", satisfaction(field));
  console.log("CA coordinates:", allCoordinates(field));
}
