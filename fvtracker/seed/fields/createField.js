import { Field } from "@/models/sectors/cultivation/Field.js";
import { drawField } from "./analyze.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";

function randomPoint(field) {
  const { width, length, min_ca_dim, max_ca_dim } = field;

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

async function createFieldObject(fieldParams, msWindow = 1000 * 10) {
  const msStart = Date.now();

  fieldParams["cultivationAreas"] = [];

  for (const [key, value] of Object.entries(fieldParams)) {
    console.log(`${key}: ${value}`);
  }

  const { name, description, location, ...fieldDAO } = fieldParams;

  function fillField(field) {
    const { width, length, gap } = field;
    let { x, y, dim_x, dim_y } = randomPoint(field);

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
    }
    const ca = [];

    for (let xi = x; xi < x + dim_x; xi++) {
      for (let yi = y; yi < y + dim_y; yi++) {
        ca.push({ row: xi, col: yi });
      }
    }
    field.cultivationAreas.push(ca);
    return fillField(field);
  }

  let fieldDao = await fillField(fieldDAO);

  const dimensions = {
    width: fieldDao.width,
    length: fieldDao.length,
  }

  const cultivationAreaDimensions = {
    min_ca_dim: fieldDao.min_ca_dim,
    max_ca_dim: fieldDao.max_ca_dim,
    gap: fieldDao.gap,
  };

  return {
    name,
    description,
    dimensions,
    cultivationAreaDimensions,
    location,
    cultivationAreas: fieldDao.cultivationAreas,
  };


  
}

export default async function createField(fieldParams, msWindow) {
  const fieldObject = await createFieldObject(fieldParams, msWindow);
  const fieldRecord = new Field(exportFieldDbData(fieldObject));

  const cultivationManager = await CultivationManager.findOne({});
  cultivationManager.fields.push(fieldRecord._id);
  fieldRecord.manager = cultivationManager._id;
  await cultivationManager.save();

  await fieldRecord.save();
  return fieldRecord;
}

function exportFieldDbData(field) {
  const { cultivationAreas, ...rest } = field;
  return rest;
}
