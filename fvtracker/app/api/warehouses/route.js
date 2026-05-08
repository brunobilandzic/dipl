import {
  createWarehouse,
  deleteWarehouse,
  deleteWarehouses,
  updateWarehouse,
} from "@/lib/warehouses";
import { getWarehouses, getWarehouse } from "@/lib/warehouses/get";
import warehousePopulateConfig from "@/lib/warehouses/populateConfig";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const warehouse = await getWarehouse({ id });
    return Response.json({ warehouse });
  } else {
    const warehouses = await getWarehouses();
    for (let wh of warehouses) {
      await wh.populate(warehousePopulateConfig);
    }
    return Response.json({ warehouses });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const warehouse = await createWarehouse({ warehouseData: body });
    return Response.json({ warehouse }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();
    await updateWarehouse({ id, data });
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    if (!id) {
      await deleteWarehouses();
      return Response.json({ success: true }, { status: 200 });
    }
    await deleteWarehouse({ id });
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}
