import models from "@/models";
import { plantedArrayToMap } from "../utils/cultivationAreas";
const { CultivationArea, Field } = models.sectors.cultivation;
import auth from "@/lib/auth";

export async function createCultivationArea(body) {
  const cultivationManager =
    await auth.session.fetchSessionSpecificManager("CultivationManager");

  const properties = transformBody(body);
  if (
    !cultivationManager.fields?.some(
      (fid) => fid?.toString() === properties.field,
    )
  ) {
    throw new Error(
      "Field with the provided ID does not belong to the user's cultivation manager.",
    );
  }

  const newCultivationArea = await createCultivationAreaRecord(properties);
  return newCultivationArea;
}

function transformBody(body) {
  const { field, name, description } = body;
  const planted = plantedArrayToMap(body.planted);
  return { field, name, description, planted };
}

async function createCultivationAreaRecord(properties) {
  const field = await Field.findById(properties.field);
  if (!field) {
    throw new Error("Field not found with the provided ID.");
  }

  const newCultivationArea = new CultivationArea(properties);
  field.cultivationAreas.push(newCultivationArea._id);
  await field.save();
  await newCultivationArea.save();
  return newCultivationArea;
}

export async function updateCultivationArea(body) {
  const cultivationArea = await CultivationArea.findById(body.id);
  if (!cultivationArea) {
    throw new Error("Cultivation area not found with the provided ID.");
  }

  const updated = Object.assign(cultivationArea, body);

  await updated.save();
  return updated;
}

export async function deleteCultivationArea(id) {
  await CultivationArea.findByIdAndDelete(id);
}
