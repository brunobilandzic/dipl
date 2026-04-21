import {
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export async function GET(request) {
  const { specificManager: productionManager } = await fetchManager({
    managerNames: [PRODUCTION_MANAGER, WAREHOUSE_MANAGER],
  });
  return Response.json({ message: "Facilities route" }, { status: 200 });
}
