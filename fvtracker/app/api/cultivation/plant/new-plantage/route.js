import auth from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    await auth.session.fetchSessionSpecificManager("CultivationManager");
    const body = await request.json();
    console.log("Received request body:", body);
    return Response.json(
      { success: true, message: "Plantage created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating plantage:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
