export async function POST(request) {
  const { warehouseRequestId, shipmentSources } = await request.json();
  console.log({ warehouseRequestId, shipmentSources });

  return Response.json({ message: "Warehouse request filled successfully" });
}
