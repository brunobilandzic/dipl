export async function POST(request) {
  try {
    const body = await request.json();
    const { cultivationAreaId, cropVarietyId, cellCoords } = body;
    console.log(body)
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
