export async function GET(request, { params }) {
  const { warehouseId } = params;
  if (warehouseId) {
    const { getWarehouse } = await import("@/lib/warehouses/get");
    const warehouse = await getWarehouse({ warehouseId });
    return new Response(JSON.stringify(warehouse));
  }
}
