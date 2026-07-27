import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { cultivationAreaId, cropVarietyId, cellCoords } = body;
    const { success, message, cropVariety, fieldCoords, cultivationArea } =
      await cultivation.crops.plant({
        cultivationAreaId,
        cropVarietyId,
        cellCoords,
      });

    return Response.json(
      { success, message, cropVariety, fieldCoords, cultivationArea },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await dbConnect();

    if (id) {
      const cropVariety = await cultivation.crops.cropVariety(id);
      return Response.json({ cropVariety }, { status: 200 });
    }

    const cropsData = await cultivation.plants.data();

    return Response.json({ ...cropsData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
