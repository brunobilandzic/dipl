import { Field } from "@/models/sectors/cultivation/Field";
import auth from "@/lib/auth";
import utils from "@/lib/utils";

export async function fieldsList(filter) {
  const fields = await Field.find(filter).sort({ createdAt: -1 });
  if (!fields) {
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

export async function fetchFieldById(id) {
  const field = await Field.findById(id);
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

export async function deletePlansFromFields({ fieldId, planId }) {
  const field = fieldId ? await fetchFieldById(fieldId) : null;
  const fields = !field ? await fieldsList({}) : null;
  if (field) {
    if (planId) {
      const planIndex = field.plantingPlans.indexOf(planId);
      if (planIndex === -1) {
        throw new Error("Plan not found in field");
      }
      field.plantingPlans.splice(planIndex, 1);
      await field.save();
      return;
    } else {
      field.plantingPlans = [];
      await field.save();
    }
  } else if (fields) {
    for (const f of fields) {
      f.plantingPlans = [];
      await f.save();
    }
  }
}

export async function getFieldForCultivation({ cultivation }) {
  await cultivation.populate({
    path: "cultivationArea",
    select: "field",
    populate: { path: "field", select: "name slug plantingPlans" },
  });
}

export const deleteFields = async ({ filter }) => {
  try {
    await Field.deleteMany(filter);
    return true;
  } catch (error) {
    console.error("Error deleting fields:", error);
    throw new Error("Greška prilikom brisanja polja. " + error.message);
  }
};
