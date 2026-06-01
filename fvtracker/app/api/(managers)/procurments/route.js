import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { getProcurments } from "@/lib/procurments/get";

export async function GET(req) {
  const { specificManager, worker, unauthorized } = await fetchManagerWorker();
  if (unauthorized) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rootManagerId = specificManager ? specificManager._id : worker.manager;
  const procurments = await getProcurments(rootManagerId);
  return Response.json(procurments, { status: 200 });
}
