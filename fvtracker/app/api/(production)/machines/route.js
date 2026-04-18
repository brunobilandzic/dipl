export async function GET() {
  try {
  } catch (error) {
    console.error("Error fetching machines:", error);
    return Response.json(
      { error: "Failed to fetch machines" },
      { status: 500 },
    );
  }
}
