export async function GET(request, { params }) {
  const { warehouseId } = params;
  if (warehouseId) {
    const { getWarehouse } = await import("@/lib/warehouses/get");
    const warehouse = await getWarehouse({ warehouseId });
  } else {
    const { getWarehouses } = await import("@/lib/warehouses/get");
    const warehouses = await getWarehouses();
    return Response.json({ warehouses });
  }
}
