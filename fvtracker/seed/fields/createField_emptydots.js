import { Field } from "@/models/sectors/cultivation/Field.js";
import { drawField, get_ca_min_max } from "./analyze.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";
import { sample } from "lodash";

function findFilled(cultivationAreas, gap) {
  const filledPoints = [];
  for (let ca of cultivationAreas) {
    if (ca.length > 0) {
      const { ca_min_x, ca_max_x, ca_min_y, ca_max_y } = get_ca_min_max(ca);

      for (let x = ca_min_x - gap; x <= ca_max_x + gap; x++) {
        for (let y = ca_min_y - gap; y <= ca_max_y + gap; y++) {
          filledPoints.push({ row: x, col: y });
        }
      }
    }
  }
  return new Set(filledPoints);
}

function findAll(width, length) {
  const allPoints = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < length; y++) {
      allPoints.push({ row: x, col: y });
    }
  }
  return new Set(allPoints);
}

function findAvailablePoints(width, length, cultivationAreas, gap) {
  const allPoints = findAll(width, length);
  const filledPoints = findFilled(cultivationAreas, gap);

  const availablePoints = new Set(allPoints.difference(filledPoints));
  return Array.from(availablePoints);
}

function randomPoint(field) {
  const { width, length, min_ca_dim, max_ca_dim } = field;

  const length_options = [];
  for (let i = min_ca_dim; i <= max_ca_dim; i++) {
    length_options.push(i);
  }

  if (field.cultivationAreas.length === 0) {
    let x = Math.floor(Math.random() * width) + 1;
    let y = Math.floor(Math.random() * length) + 1;
    let dim_x =
      length_options[Math.floor(Math.random() * length_options.length)];
    let dim_y =
      length_options[Math.floor(Math.random() * length_options.length)];
    return { x, y, dim_x, dim_y };
  }
  const point = sample(
    findAvailablePoints(width, length, field.cultivationAreas, field.gap),
  );
  const distance = getDistance(point, field.cultivationAreas, field.gap);

  if (!distance.distanceX || !distance.distanceY) {
    let x = Math.floor(Math.random() * width) + 1;
    let y = Math.floor(Math.random() * length) + 1;
    let dim_x =
      length_options[Math.floor(Math.random() * length_options.length)];
    let dim_y =
      length_options[Math.floor(Math.random() * length_options.length)];
    return { x, y, dim_x, dim_y };
  }

  console.log("Distance:", distance);
  /*
    distance is distance to next filled point in x and y direction
    we need to choose length between min_ca_dim and distance.distanceX (or Y)
  */

  const adjustedLengthOptionsX = length_options.filter(
    (len) => len <= distance.distanceX,
  );
  const adjustedLengthOptionsY = length_options.filter(
    (len) => len <= distance.distanceY,
  );

  const dim_x =
    adjustedLengthOptionsX[
      Math.floor(Math.random() * adjustedLengthOptionsX.length)
    ];
  const dim_y =
    adjustedLengthOptionsY[
      Math.floor(Math.random() * adjustedLengthOptionsY.length)
    ];

  let x = point.row;
  let y = point.col;
  console.log({ x, y, dim_x, dim_y });
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

function getDistance(point, filledPoints, gap) {
  const { row: x, col: y } = point;
  console.log("Calculating distance from point:", point);
  const { xArray, yArray } = getXYArray(filledPoints);
  const distance = {
    distanceX: null,
    distanceY: null,
  };

  const nextX = xArray.find((xi, i) => xi > x);
  const nextY = yArray.find((yi, i) => yi > y);

  distance.distanceX = nextX - x - gap;
  distance.distanceY = nextY - y - gap;
  console.log("NextX:", nextX, "NextY:", nextY);
  return distance;
}

function getXYArray(cultivationAreas) {
  const xSet = new Set();
  const ySet = new Set();

  for (let ca of cultivationAreas) {
    for (let point of ca) {
      xSet.add(point.row);
      ySet.add(point.col);
    }
  }
  const xArray = Array.from(xSet).sort((a, b) => a - b);
  const yArray = Array.from(ySet).sort((a, b) => a - b);

  return { xArray, yArray };
}

async function createFieldObject(fieldParams, msWindow = 1000 * 10) {
  const msStart = Date.now();

  fieldParams["cultivationAreas"] = [];

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
    if (ca.length > 0) {
      field.cultivationAreas.push(ca);
    }
    return fillField(field);
  }

  let fieldDao = await fillField(fieldDAO);

  const dimensions = {
    width: fieldDao.width,
    length: fieldDao.length,
  };

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
