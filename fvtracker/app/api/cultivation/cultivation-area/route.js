import dbConnect from "@/lib/db/mongooseConnect";
import cultivation from "@/lib/cultivation";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newCultivationArea = await cultivation.cultivationArea.create(body);
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


