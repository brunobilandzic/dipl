import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    const { fieldId, name, description, planted } = body;
    if (!cultivationManager.fields?.some((fid) => fid === fieldId)) {
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
