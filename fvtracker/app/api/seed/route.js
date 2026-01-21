import { seedDocuments } from "@/lib/seed";

export async function POST(req) {
  console.log("Seed route POST called");
  try {
    const {seedType} = await req.json();
    const result = await seedDocuments(seedType);
    console.log(seedType, "Seeding result:", result?.length);
    return Response.json(
      { message: "Seeding completed successfully", result },
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
