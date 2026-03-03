import models from "@/models";
import { plantedArrayToMap } from "@/lib/utils/cultivationAreas";
const { CultivationArea, Field } = models.sectors.cultivation;
import auth from "@/lib/auth";

export async function createCultivationArea(body) {
  const cultivationManager =
    await auth.session.fetchSessionSpecificManager("CultivationManager");

  if (
    !cultivationManager.fields?.some((fid) => fid?.toString() === body.field)
  ) {
    throw new Error(
      "Field with the provided ID does not belong to the user's cultivation manager.",
    );
  }

  const newCultivationArea = await createCultivationAreaRecord(body);
  return newCultivationArea;
}

function transformBody(body) {
  const { field, name, description, planted } = body;
  // const planted = plantedArrayToMap(body.planted);
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

const updateCultivation = async (body) => {
  //todo
};

export async function updateCultivationArea(body) {
  if (body.cultivationId) {
    const cutivation = await updateCultivation(body);
    return cutivation;
  }
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

export const getCultivationArea = async (id) => {
  const cultivationManager =
    await auth.session.fetchSessionSpecificManager("CultivationManager");
  await cultivationManager.populate({
    path: "fields",
    populate: {
      path: "cultivationAreas",
      match: { _id: id },
    },
  });

  const cultivationArea = cultivationManager.fields.reduce((found, field) => {
    if (found) return found;
    return field.cultivationAreas.find((area) => area._id.toString() === id);
  }, null);

  if (!cultivationArea) {
    throw new Error("Cultivation area not found with the provided ID.");
  }

  return cultivationArea;
};
