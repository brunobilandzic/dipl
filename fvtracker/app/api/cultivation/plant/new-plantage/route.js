import auth from "@/lib/auth";
import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    const newPlantage = await cultivation.plants.create(body);
    return Response.json(newPlantage, { status: 200 });
  } catch (error) {
    console.error("Error creating plantage:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
