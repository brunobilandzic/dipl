import dbConnect from "@/lib/db/mongooseConnect";

export async function GET(req) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
  return Response.json({ message: "Database connected successfully" });
}
