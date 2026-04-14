import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(request) {
  const { generalManager, specificManager, unauthorized } = await fetchManager({
    managerNames: [PRODUCTION_MANAGER],
  });
  if (unauthorized) {
    return Response.json({ unauthorized: true }, { status: 403 });
  }
}
