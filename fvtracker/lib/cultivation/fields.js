import { Field } from "@/models/sectors/cultivation/Field";
import auth from "@/lib/auth";
import utils from "@/lib/utils";

export async function fieldsList(filter) {
  const fields = await Field.find(filter).sort({ createdAt: -1 });
  if (!fields || fields.length === 0) {
    throw new Error("No fields found");
  }
  return fields;
}

export async function fetchFieldBySlug(slug) {
  const field = await Field.findOne({ slug });
  if (!field) {
    throw new Error("Field not found");
  }
  return field;
}

export async function createField(body) {
  console.log("Creating field with data:", body);

  const cultivationManager = await auth.session.specificManager({
    managerName: "CultivationManager",
  });

  await cultivationManager.populate("fields");
  checkFieldNameUnique(
    cultivationManager.fields?.map((f) => f.name),
    body.name,
  );

  const field = await createFieldRecord({
    manager: cultivationManager._id,
    ...body,
  });
  cultivationManager.fields.push(field);
  await cultivationManager.save();

  return field;
}

function checkFieldNameUnique(fieldNames, name) {
  const { sanitize } = utils.strings;
  const sanitizedName = sanitize(name);

  if (fieldNames.some((f) => sanitize(f) === sanitizedName)) {
    throw new Error("Field name must be unique");
  }
}

async function createFieldRecord(properties) {
  const newField = new Field(properties);
  await newField.save();
  return newField;
}
