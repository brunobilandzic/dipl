import { Field } from "@/models/sectors/cultivation/Field.js";
import { drawField } from "./analyze.js";
import { CultivationManager } from "@/models/user/managers/CultivationManager.js";
import {
  createFieldTimeMs,
  cultivationAreaNamesConstant,
  optimizedParams,
  optimizedParamsArray,
} from "../../../data/fields.js";
import dbConnect from "@/lib/db/mongooseConnect.js";
import { deleteFieldsWithDocs } from "@/lib/db/delete.js";
import { randomPoint, notValidPoint } from "./generateCell.js";
import { CropVariety } from "@/models/sectors/cultivation/Crops.js";
import { CultivationArea } from "@/models/sectors/cultivation/Cultivation.js";
import { createCultivation } from "../../cultivation/index.js";
import {} from "../../crops/crops.js";
import crops from "../../crops/index.js";

await dbConnect();

async function createFieldObject(fieldParams, msWindow = createFieldTimeMs) {
  const msStart = Date.now();
  const { name, description, ...fieldDAO } = fieldParams;
  const _cultivationAreaNamesConstant = [...cultivationAreaNamesConstant];

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
      if (elapsed > msWindow && field.cultivationAreas.length > 0) {
        return field;
      }
    }
    field.cultivationAreas.push(
      createCultivationArea(
        x,
        y,
        dim_x,
        dim_y,
        randomCultivationAreaName(_cultivationAreaNamesConstant),
      ),
    );
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
    cultivationAreas: fieldDao.cultivationAreas,
  };
}

async function createFieldsObjects(
  fieldParamsArray = optimizedParamsArray,
  msWindow = createFieldTimeMs,
) {
  /*   await deleteFieldsWithDocs(); */
  console.log(`Creating ${fieldParamsArray.length} fields...`);
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
  /* for (let field of fieldObjects) {
    drawField(field);
  } */
  return fieldObjects;
}

export async function createFields(
  fieldParamsArray = optimizedParamsArray,
  msWindow = createFieldTimeMs,
) {
  await deleteFieldsWithDocs();
  const fieldObjects = await createFieldsObjects(fieldParamsArray, msWindow);

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

  const cropVariety = await CropVariety.findOne({ name: "Idared" });

  await cultivationManager.save();
  await fieldRecord.save();

  const cultivationAreasPromises = fieldObject.cultivationAreas.map(
    async (ca) => {
      const newCultivationArea = await fieldRecord.addCultivationArea(ca);
      return newCultivationArea;
    },
  );
  await Promise.all(cultivationAreasPromises);
  const cultivationCA = await CultivationArea.findOne().sort({
    "dimensions.width": -1,
  });
  const cultivation = await createCultivation({
    cultivationArea: cultivationCA,
  });

  await cultivation.populate("plantedCropVarieties");
  await crops.plantageHarvest({
    fieldId: fieldRecord._id,
    cultivation,
  });
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

function createCultivationArea(x, y, dim_x, dim_y, { name, description }) {
  const plantedEmpty = [];
  for (let yi = y; yi < y + dim_y; yi++) {
    for (let xi = x; xi < x + dim_x; xi++) {
      plantedEmpty.push(`${xi},${yi}`);
    }
  }

  return {
    name,
    description,
    planted: plantedEmpty,
  };
}

function randomCultivationAreaName(cultivationAreaNames) {
  // kad se potroše imena, generira se rezervno da polje može imati više područja
  if (cultivationAreaNames.length === 0) {
    return {
      name: `Područje ${Math.floor(Math.random() * 1000000)}`,
      description: "",
    };
  }
  const datapoint = cultivationAreaNames.splice(
    Math.floor(Math.random() * cultivationAreaNames.length),
    1,
  )[0];
  return datapoint;
}

