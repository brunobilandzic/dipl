import dbConnect from "@/lib/db/mongooseConnect";
import cultivation from "@/lib/cultivation";
import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    if (id) {
      const cultivationArea = await cultivation.cultivationArea.get(id);
      return Response.json({ cultivationArea }, { status: 200 });
    }
    if (!id) {
      throw new Error("ID is required");
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

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
    const updated = await cultivation.cultivationArea.update(body);

    return Response.json({ updatedCultivationArea: updated }, { status: 200 });
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
    const deleted = await cultivation.cultivationArea.delete(id);
    if (!deleted) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
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
