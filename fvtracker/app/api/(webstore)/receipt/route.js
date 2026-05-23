import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";

export async function POST(req) {
  try {
    const { specificManager: financialManager, unauthorized } =
      await fetchManager({
        managerNames: [FINANCIAL_MANAGER],
      });
    if (unauthorized) {
      return Response.json({ error: "Nema dozvole" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error creating receipt:", error);
    return Response.json({
      error: "Greška prilikom kreiranja računa",
    });
  }
}
