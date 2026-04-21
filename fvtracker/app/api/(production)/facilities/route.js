import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { getFacilities } from "@/lib/production/facilities/get";

export async function GET(request) {
  const { specificManager: productionManager } = await fetchManager({
    managerNames: [PRODUCTION_MANAGER, WAREHOUSE_MANAGER],
  });
  const facilities = await getFacilities();
  return Response.json({ facilities }, { status: 200 });
}
