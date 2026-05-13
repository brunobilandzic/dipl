import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(request) {}
export async function POST(request) {
  try {
    const { unauthorized } = await fetchManager({
      managerNames: [FINANCIAL_MANAGER],
    });
    if (unauthorized) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error creating warehouse request:", error);
    return new Response(
      JSON.stringify({ message: "Greška prilikom izrade zahtjeva skladištu." }),
      { status: 500 },
    );
  }
}
