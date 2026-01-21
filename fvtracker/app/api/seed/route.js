import { seedManagers } from "@/lib/seed/managers";

export async function POST(req) {
  console.log("Seed route POST called");
  try {
    const body = await req.json();
    console.log("Request body:", body);
    const result = await seedManagers();
    console.log("Seeding result:", result);
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
