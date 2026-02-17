import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";
import { CultivationArea } from "@/models/sectors/cultivation/Cultivation";
import { Field } from "@/models/sectors/cultivation/Field";
import { plantedArrayToMap } from "@/lib/utils/cultivationAreas";

export async function POST(request) {
  try {
    await dbConnect();
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
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

    const newCultivationArea = await createCultivationArea(properties);

    return Response.json({ newCultivationArea }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}

function transformBody(body) {
  const { field, name, description } = body;
  const planted = plantedArrayToMap(body.planted);
  return { field, name, description, planted };
}

async function createCultivationArea(properties) {
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
