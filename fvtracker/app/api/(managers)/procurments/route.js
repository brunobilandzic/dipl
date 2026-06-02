import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import {
  FINANCIAL_MANAGER,
  MANAGER_TYPES,
} from "@/lib/constants/users/managerTypes";
import { createProcurment } from "@/lib/procurments/create";
import { getAllProcurments, getProcurments } from "@/lib/procurments/get";
import { GeneralManager } from "@/models/user/managers/GeneralManager";

export async function GET(req) {
  const { specificManager, gerneralManager, unauthorized } = await fetchManager(
    { managerNames: MANAGER_TYPES },
  );
  if (unauthorized || (!specificManager && !gerneralManager)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  let procurments;
  if (
    specificManager.rootManager?.managerModelName == FINANCIAL_MANAGER ||
    GeneralManager
  ) {
    procurments = await getAllProcurments();
    return Response.json({ procurments }, { status: 200 });
  }

  const rootManagerId = specificManager
    ? specificManager.rootManager._id
    : gerneralManager._id;
  //if gen or fin man, fetch all, later
  procurments = await getProcurments(rootManagerId);
  return Response.json({ procurments }, { status: 200 });
}

export async function POST(req) {
  const { specificManager, gerneralManager, unauthorized } = await fetchManager(
    { managerNames: MANAGER_TYPES },
  );
  if (unauthorized || (!specificManager && !gerneralManager)) {
    return Response.json(
      { message: "Nije dozvoljena izrada nabavke." },
      { status: 401 },
    );
  }
  const { newProcurmentData } = await req.json();
  console.log("Received new procurment data:", newProcurmentData);
  const rootManagerId = specificManager
    ? specificManager.rootManager._id
    : gerneralManager._id;

  const procurment = await createProcurment({
    ...newProcurmentData,
    manager: rootManagerId,
  });
  return Response.json({ procurment }, { status: 201 });
}
