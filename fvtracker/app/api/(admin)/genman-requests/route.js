export async function GET(request) {
  try {
    const { unauthorized, admin } = await fetchSessionData({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error fetching general manager requests:", error);
    return Response.json(
      { error: "Greška prilikom dohvatanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}
