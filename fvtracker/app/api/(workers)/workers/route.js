import {
  fetchManager,
  fetchSessionRootManager,
} from "@/lib/auth/fetchSessionData";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { createWorker } from "@/lib/workers/create";
import { getWorkers } from "@/lib/workers/get";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const managerModelName = req.nextUrl.searchParams.get("managerModelName");
    await dbConnect();
    const { specificManager, unauthorized } = await fetchManager({
      managerNames: [managerModelName],
    });
    if (unauthorized) {
      return Response.json(
        { error: "Nemate pravo pristupa radnicima" },
        { status: 403 },
      );
    }
    const workers = await getWorkers({
      rootManagerId: specificManager?.rootManager._id,
      managerModelName: managerModelName,
    });
    return Response.json({ workers });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return Response.json(
      { error: "Greška pri dohvaćanju radnika" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    let { rootManager, unauthorized, generalManager, isAdmin } =
      await fetchSessionRootManager();
    if (unauthorized) {
      return Response.json(
        { error: "Nemate pravo pristupa radnicima" },
        { status: 403 },
      );
    }
    const { workerData } = await req.json();
    if (!rootManager || generalManager) {
      const specoficManager =
        await mongoose.models[workerData.managerModelName].findOne();
      rootManager = specoficManager.rootManager;
    }
    const { specificWorker } = await createWorker({
      rootManagerId: rootManager._id,
      workerData,
      isGeneralAdmin: generalManager || isAdmin,
    });
    console.log(
      "Worker created successfully:",
      specificWorker.appUser.email,
      specificWorker.manager.managerModelName,
      specificWorker.employmentRequest.status,
    );
    return Response.json({ worker: specificWorker });
  } catch (error) {
    console.error("Worker creation error:", error);
    return Response.json(
      { error: "Greška pri kreiranju radnika" },
      { status: 500 },
    );
  }
}
