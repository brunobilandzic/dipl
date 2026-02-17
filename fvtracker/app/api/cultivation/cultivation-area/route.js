import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    const properties = getPropertiesForNewCA(body);
    if (!cultivationManager.fields?.some((fid) => fid === properties.fieldId)) {
      throw new Error(
        "Field with the provided ID does not belong to the user's cultivation manager.",
      );
    }
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

function getPropertiesForNewCA(body) {
  const { fieldId, name, description, planted } = body;
  return { fieldId, name, description, planted };
}
