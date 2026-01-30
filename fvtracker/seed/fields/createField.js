import { fieldParams } from "../data/fields.js";
import get_ca_min_max from "./analyze.js";

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

function notValidPoint(field, x, y, dim_x, dim_y) {
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

async function createField(fieldParams, msWindow = 1000 * 10) {
  /* 
  params example:
    {
    name: "Small CAS",
    width: 100,
    length: 100,
    min_ca_dim: 12,
    max_ca_dim: 30,
    gap: 2,
  }
 */

  const msStart = Date.now();

  const { width, length, min_ca_dim, max_ca_dim, gap } = fieldParams;

  const field = {
    width: width,
    length: length,
    min_ca_dim,
    max_ca_dim,
    gap,
    cultivationAreas: [],
  };

  function tryAITime(field) {
    const { width, length } = field;
    /*     if (ratio(field) > nessary_ratio) {
      console.log("Field is properly seeded to the end.");
      return field;
    } */

    let { x, y, dim_x, dim_y } = randomPoint(field);

    let reasonableAttempts = 0;

    while (
      notValidPoint(field, x, y, dim_x, dim_y) ||
      x + dim_x + gap > width ||
      y + dim_y + gap > length
    ) {
      ({ x, y, dim_x, dim_y } = randomPoint(field));
      const loopTime = Date.now();
      if ((loopTime - msStart) % 10000 < 5) {
        console.log(
          "Trying to find valid point...",
          (loopTime - msStart) / 1000,
          "seconds elapsed.",
        );
        satisfaction(field);
      }
      if (loopTime - msStart > msWindow && field.cultivationAreas.length > 0) {
        console.log(
          "Time window exceeded, stopping field creation.", msWindow /1000, "seconds."
        );
        return field;
      }
      /* reasonableAttempts += 1;
      if (reasonableAttempts % 1000 === 0) {
        console.log(
          "Still trying to find a valid point...",
          reasonableAttempts,
        );
      }
      if (reasonableAttempts > 10000) {
        // drawGridPlainer(field);
        return field;
      } */
      /* 
      
      if (loopTime - msStart > msWindow) {
        console.log(
          "Time window exceeded, stopping field creation.",
          loopTime - msStart,
        );
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
    return tryAITime(field);
  }

  let fieldResult = await tryAITime(field);
  const msEnd = Date.now();
  return fieldResult;
}

async function test() {
  const promises = [];

  for (let _fieldParams of fieldParams) {
    promises.push(createField(_fieldParams));
  }

  const fields = await Promise.all(promises);
  for (let field of fields) {
    satisfaction(field);
  }
  console.log(`\n\nThere ara ${fields.length} fields created.`);
  return fields;
}

async function main() {
  const fields = await test();
}

main();

function drawGridPlainer(field) {
  const { width, length, cultivationAreas } = field;

  analyzeField(field);
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

function analyzeField(field) {}

function sum_points(field) {
  const { width, length } = field;
  return width * length;
}

function fieldCultivationAreaPoints(field) {
  return field.cultivationAreas.reduce(function (sum, ca) {
    return sum + ca.length;
  }, 0);
}

export function satisfaction(field) {
  const fieldPoints = sum_points(field);
  const caPoints = fieldCultivationAreaPoints(field);
  const ratio = caPoints / fieldPoints;
  console.log(
    `Field points: ${fieldPoints}, CA points: ${caPoints}, Ratio: ${ratio}`,
  );
  return ratio >= SATISFACTORY_FILLED;
}
