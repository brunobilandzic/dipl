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

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("updating: \n", body);
    const updatedCultivationArea =
      await cultivation.cultivationArea.update(body);
    return Response.json({ updatedCultivationArea }, { status: 200 });
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

export async function DELETE(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = body;
    await cultivation.cultivationArea.delete(id);
    return Response.json({ success: true }, { status: 200 });
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
