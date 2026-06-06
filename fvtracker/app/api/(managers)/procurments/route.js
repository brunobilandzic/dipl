import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import {
  FINANCIAL_MANAGER,
  MANAGER_TYPES,
  GENERAL_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { createProcurment } from "@/lib/procurments/create";
import { getAllProcurments, getProcurments } from "@/lib/procurments/get";
import { Procurment } from "@/models/documents/Procurment";
import { GeneralManager } from "@/models/user/managers/GeneralManager";

export async function GET(req) {
  try {
    await dbConnect();
    const { specificManager, generalManager, unauthorized } =
      await fetchManager({ managerNames: MANAGER_TYPES });
    if (unauthorized || (!specificManager && !generalManager)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    let procurments;
    if (
      specificManager.rootManager?.managerModelName == FINANCIAL_MANAGER ||
      generalManager
    ) {
      procurments = await getAllProcurments();
      return Response.json({ procurments }, { status: 200 });
    }

    const rootManagerId = specificManager
      ? specificManager.rootManager._id
      : generalManager._id;
    //if gen or fin man, fetch all, later
    procurments = await getProcurments(rootManagerId);
    return Response.json({ procurments }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Došlo je do greške pri dohvaćanju nabavki." },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({ managerNames: MANAGER_TYPES });
    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Nije dozvoljena izrada nabavke." },
        { status: 401 },
      );
    }
    const { newProcurmentData } = await req.json();
    const rootManagerId = specificManager
      ? specificManager.rootManager._id
      : gerneralManager._id;

    const procurment = await createProcurment({
      ...newProcurmentData,
      manager: rootManagerId,
    });
    return Response.json({ procurment }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Došlo je do greške pri izradi nove nabavke." },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({
        managerNames: [FINANCIAL_MANAGER, GENERAL_MANAGER],
      });
    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Zabrana promjena statusa nabavke." },
        { status: 403 },
      );
    }
    const { procurmentId, newStatus } = await req.json();
    await Procurment.findByIdAndUpdate(procurmentId, { status: newStatus });
    return Response.json(
      { message: `Status nabavke ${procurmentId} promijenjen u ${newStatus}.` },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Došlo je do greške pri promjeni statusa nabavke." },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({ managerNames: MANAGER_TYPES });
    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Zabrana brisanja nabavke." },
        { status: 403 },
      );
    }
    const { procurmentId } = await req.json();
    await Procurment.findByIdAndDelete(procurmentId);
    return Response.json(
      { message: `Nabavka ${procurmentId} obrisana.` },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Došlo je do greške pri brisanju nabavke." },
      { status: 500 },
    );
  }
}
