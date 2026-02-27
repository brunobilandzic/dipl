import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();

    const newCultivation =
      await cultivation.cultivation.createCultivation(body);

    console.log(newCultivation);

    return Response.json({ newCultivation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
