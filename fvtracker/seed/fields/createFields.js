import { Field } from "@/models/sectors/cultivation/Field.js";
import { drawField, fieldFilledRatio, printFieldParams } from "./analyze.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";
import {
  createFieldTimeMs,
  optimizedParams,
  optimizedParamsArray,
  randomCultivationAreaName,
} from "../data/fields.js";
import dbConnect from "@/lib/db/mongooseConnect.js";
import { CultivationArea } from "@/models/sectors/cultivation/Cultivation.js";

await dbConnect();

async function deleteFieldsWithDocs() {
  await Field.deleteMany({});
  await CultivationArea.deleteMany({});
  await CultivationManager.updateMany({}, { $set: { fields: [] } });
  console.log(
    "Deleted existing fields, cultivation areas, and field grid cells.",
  );
}

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
  let { width, length, cultivationAreas, gap } = field;
  const plantedCells =
    cultivationAreas
      ?.map((ca) => ca.planted)
      ?.reduce((acc, planted) => {
        if (planted) {
          for (let entry of planted.entries()) {
            acc.push(entry);
          }
        }
        return acc;
      }, []) || [];

  if (x < 0 || y < 0 || x + dim_x > width || y + dim_y > length) {
    return true;
  }

  for (let xi = x; xi <= x + dim_x + gap; xi++) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let plantedCell of plantedCells) {
        if (plantedCell[0] === `${xi},${yi}`) {
          return true;
        }
      }
    }
    for (let yi = y; yi >= y - gap; yi--) {
      for (let plantedCell of plantedCells) {
        if (plantedCell[0] === `${xi},${yi}`) {
          return true;
        }
      }
    }
  }

  for (let xi = x; xi >= x - gap; xi--) {
    for (let yi = y; yi <= y + dim_y + gap; yi++) {
      for (let plantedCell of plantedCells) {
        if (plantedCell[0] === `${xi},${yi}`) {
          return true;
        }
      }
    }
  }

  return false;
}

async function createFieldObject(fieldParams, msWindow = createFieldTimeMs) {
  const msStart = Date.now();

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
      if (elapsed % 1000 === 0) {
        // 1 sec passed
      }
      if (elapsed > msWindow && field.cultivationAreas.length > 0) {
        console.log(
          "Time window exceeded, stopping field creation.",
          elapsed / 1000,
          "seconds.",
        );
        fieldParams["ratio"] = `${fieldFilledRatio(field) * 100}%`;
        printFieldParams(field);
        return field;
      }
    }
    field.cultivationAreas.push(createCultivationArea(x, y, dim_x, dim_y));
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

async function createFieldsObjects(
  fieldParamsArray = optimizedParamsArray,
  msWindow = createFieldTimeMs,
) {
  await deleteFieldsWithDocs();
  const fieldObjects = [];
  const fieldPromises = [];
  for (let fieldParams of fieldParamsArray) {
    const fieldParamsCopy = { ...fieldParams };
    fieldPromises.push(createFieldObject(fieldParamsCopy, msWindow));
  }
  const resolvedFields = await Promise.all(fieldPromises);
  for (let field of resolvedFields) {
    fieldObjects.push(field);
  }
  return fieldObjects;
}

export async function createFields(
  fieldParamsArray = optimizedParamsArray,
  msWindow = createFieldTimeMs,
) {
  await deleteFieldsWithDocs();
  const fieldObjects = await createFieldsObjects(fieldParamsArray, msWindow);
  console.log(
    `Created ${fieldObjects.length} field objects. Now creating field records...`,
  );

  const fieldRecords = [];
  const fieldRecordPromises = [];

  for (let fieldObject of fieldObjects) {
    fieldRecordPromises.push(createFieldRecord(fieldObject));
  }
  const resolvedFieldRecords = await Promise.all(fieldRecordPromises);

  for (let fieldRecord of resolvedFieldRecords) {
    fieldRecords.push(fieldRecord);
  }

  console.log(
    `${fieldRecords.map((fr) => fr.name).join(", ")} field records created successfully.`,
  );
  return fieldRecords;
}

export async function createFieldRecord(fieldObject) {
  const fieldRecord = new Field(exportFieldDbData(fieldObject));

  const cultivationManager = await CultivationManager.findOne({});
  cultivationManager.fields.push(fieldRecord._id);
  fieldRecord.manager = cultivationManager._id;
  await cultivationManager.save();
  await fieldRecord.save();
  const cultivationAreasPromises = fieldObject.cultivationAreas.map(
    async (ca) => {
      const newCultivationArea = await fieldRecord.addCultivationArea(ca);
      return newCultivationArea;
    },
  );
  await Promise.all(cultivationAreasPromises);
  await fieldRecord.save();
  return fieldRecord;
}

export default async function createField(
  fieldParams = optimizedParams,
  msWindow = createFieldTimeMs,
) {
  await dbConnect();
  const fieldObject = await createFieldObject(fieldParams, msWindow);
  const fieldRecord = new Field(exportFieldDbData(fieldObject));
  const cultivationManager = await CultivationManager.findOne({});
  cultivationManager.fields.push(fieldRecord._id);
  await cultivationManager.save();
  fieldRecord.manager = cultivationManager._id;
  await fieldRecord.save();

  const cultivationAreasPromises = fieldObject.cultivationAreas.map(
    async (ca) => {
      const newCultivationArea = await fieldRecord.addCultivationArea(ca);
      return newCultivationArea;
    },
  );
  await Promise.all(cultivationAreasPromises);

  await fieldRecord.save();
  return fieldRecord;
}

function exportFieldDbData(field) {
  const { cultivationAreas, _id, id, ...rest } = field;
  return rest;
}

function createCultivationArea(x, y, dim_x, dim_y) {
  const { name, description } = randomCultivationAreaName();
  const plantedEmpty = new Map();
  for (let xi = x; xi < x + dim_x; xi++) {
    for (let yi = y; yi < y + dim_y; yi++) {
      plantedEmpty.set(`${xi},${yi}`, null);
    }
  }

  return {
    name,
    description,
    planted: plantedEmpty,
  };
}
