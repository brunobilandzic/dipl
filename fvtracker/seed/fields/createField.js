import { optimizedParams } from "../data/fields.js";
import { drawField, fieldFilledRatio } from "./analyze.js";

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
  const { width, length, cultivationAreas, gap } = field;

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

export default async function createField(fieldParams, msWindow = 1000 * 10) {
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

  for (const [key, value] of Object.entries(fieldParams)) {
    console.log(`${key}: ${value}`);
  }

  const field = {
    width,
    length,
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
      const elapsed = loopTime - msStart;
      if (elapsed % 10000 === 0) {
        console.log(
          "Trying to find valid point...",
          (loopTime - msStart) / 1000,
          "seconds elapsed.",
        );
      }
      if (elapsed > msWindow && field.cultivationAreas.length > 0) {
        console.log(
          "Time window exceeded, stopping field creation.",
          elapsed / 1000,
          "seconds.",
        );
        drawField(field);
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
  return fieldResult;
}

async function test() {
  /* const promises = [];

  for (let _fieldParams of fieldParams) {
    promises.push(createField(_fieldParams));
  }

  const fields = await Promise.all(promises);
  for (let field of fields) {
    filledRatio(field);
  }
  console.log(`\n\nThere ara ${fields.length} fields created.`);
  return fields; */

  const field = await createField(optimizedParams, 1000 * 20);
  console.log("\n\nOptimized field created:\n");
  fieldFilledRatio(field);

  drawField(field);
}

async function main() {
  await test();
}
