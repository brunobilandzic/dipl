import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    if (!body?.data)
      throw new Error("Missing cultivation details in request body");
    const newCultivation = await cultivation.cultivations.create(
      body.data,
    );

    console.log(newCultivation);

    return Response.json({ newCultivation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    const updatedCultivation = await cultivation.cultivations.update(body);
    return Response.json({ updatedCultivation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
