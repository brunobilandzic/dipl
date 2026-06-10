import { getSpecicManagers } from "@/lib/generalManager";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url).searchParams;
    const specificManagers = await getSpecicManagers();
    return Response.json({ specificManagers });
  } catch (error) {
    console.error("Error fetching specific managers:", error);
    return new Response(
      JSON.stringify({ error: "Greška pri dohvaćanju specifičnih menadžera" }),
      { status: 500 },
    );
  }
}
