export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const { getWarehouse } = await import("@/lib/warehouses/get");
    const warehouse = await getWarehouse({ id });
    return Response.json({ warehouse });
  } else {
    const { getWarehouses } = await import("@/lib/warehouses/get");
    const warehouses = await getWarehouses();
    return Response.json({ warehouses });
  }
}
