import seed from "@/lib/seed";

export async function POST(req) {
  console.log("Seed route POST called");
  try {
    const { seedType } = await req.json();
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
