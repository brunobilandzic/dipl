export async function GET(request) {
  try {
  } catch (error) {
    console.error("Error fetching general manager requests:", error);
    return Response.json(
      { error: "Greška prilikom dohvatanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}
