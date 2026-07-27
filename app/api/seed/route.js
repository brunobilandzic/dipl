import dbConnect from "@/lib/db/mongooseConnect";
import seed from "@/seed";

export async function POST(req) {
  console.log("Seed route POST called");
  try {
    await dbConnect();
    let body = {};
    try {
      body = await req.json();
    } catch {
      console.log("No JSON body provided, proceeding with empty body.");
      body = {};
    }

    const { seedType } = body ?? {};

    if (!seedType) {
      return Response.json({ error: "seedType missing" }, { status: 400 });
    }

    const result = await seed.handleAPIRequest(seedType);
    return Response.json(
      {
        message: `Seeding completed successfully for type: ${seedType}`,
        result,
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in Seed route POST:", error);
    return Response.json(
      {
        message: "Error during seeding",
        error,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
