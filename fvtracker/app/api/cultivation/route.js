import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const body = await request.json();
    if (!body?.data)
      throw new Error("Missing cultivation details in request body");
    const newCultivation = await cultivation.cultivations.create(body.data);

    return Response.json({ newCultivation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const body = await request.json();
    const updatedCultivation = await cultivation.cultivations.update(body);
    return Response.json({ updatedCultivation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleted = await cultivation.cultivations.delete(id);
    if (!deleted) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
