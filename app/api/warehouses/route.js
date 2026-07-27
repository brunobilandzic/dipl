import { fetchManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import {
  createWarehouse,
  deleteWarehouse,
  deleteWarehouses,
  updateWarehouse,
} from "@/lib/warehouses";
import { getWarehouses, getWarehouse } from "@/lib/warehouses/get";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const warehouse = await getWarehouse({ id });
    return Response.json({ warehouse });
  }
  const { specificManager: warehouseManager, unauthorized } =
    await fetchManager({
      managerNames: [WAREHOUSE_MANAGER],
    });

  if (warehouseManager) {
    const warehouses = await getWarehouses({ managerId: warehouseManager._id });
    return Response.json({ warehouses });
  } else {
    const warehouses = await getWarehouses({});
    return Response.json({ warehouses });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { specificManager: warehouseManager, unauthorized } =
      await fetchManager({
        managerNames: [WAREHOUSE_MANAGER],
      });
    if (unauthorized) {
      return Response.json(
        { error: "Unauthorized: user is not a warehouse manager" },
        { status: 403 },
      );
    }
    const body = await request.json();
    const warehouse = await createWarehouse({
      warehouseData: body,
      warehouseManager,
    });
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
    await dbConnect();
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
    await dbConnect();
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
