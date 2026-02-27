export async function POST(request) {
  try {
    return Response.json(
      { success: true, message: "Planting successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
