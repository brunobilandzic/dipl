import { fetchSessionRootManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { rootManager, unauthorized } = await fetchSessionRootManager();
    if (unauthorized) {
      return Response.json(
        { error: "Nemate pravo pristupa radnicima" },
        { status: 403 },
      );
    }


  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
  return Response.json({ message: "Database connected successfully" });
}
