import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { MANAGER_TYPES } from "@/lib/constants/users/managerTypes";
import { getProcurments } from "@/lib/procurments/get";

export async function GET(req) {
  const { specificManager, gerneralManager, unauthorized } = await fetchManager(
    { managerNames: MANAGER_TYPES },
  );
  if (unauthorized || (!specificManager && !gerneralManager)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rootManagerId = specificManager
    ? specificManager.rootManager._id
    : gerneralManager._id;
  //if gen or fin man, fetch all, later
  const procurments = await getProcurments(rootManagerId);
  return Response.json({ procurments }, { status: 200 });
}
