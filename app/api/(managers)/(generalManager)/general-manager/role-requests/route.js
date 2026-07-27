import {
  fetchAdmin,
  fetchSessionSpecificManager,
} from "@/lib/auth/fetchSessionData";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { RoleRequest } from "@/models/documents/requests/RoleRequest";

export async function PUT(req) {
  // do not mix req response with Next.js Response object
  try {
    await dbConnect();
    const { admin } = await fetchAdmin();
    if (!admin) {
      await fetchSessionSpecificManager({ managerName: GENERAL_MANAGER });
    }
    const { requestId, response } = await req.json();
    const roleRequest = await RoleRequest.findById(requestId);
    if (!roleRequest) {
      return Response.json(
        { error: "Zahtjev nije pronađen." },
        { status: 404 },
      );
    }
    await roleRequest.populate("rootManager", "managerModelName");
    const roleRequests = await RoleRequest.find().populate(
      "rootManager",
      "managerModelName",
    );
    const someApprovedRequest = roleRequests.some(
      (rr) =>
        rr.rootManager.managerModelName ===
          roleRequest.rootManager.managerModelName &&
        rr.status === ROLE_STATUSES.APPROVED &&
        response === ROLE_STATUSES.APPROVED,
    );
    if (someApprovedRequest) {
      return Response.json(
        {
          error: `Menadžer ${roleRequest.rootManager.managerModelName} s odobrenom ulogom već postoji.`,
        },
        { status: 400 },
      );
    }
    await RoleRequest.updateOne(
      { _id: requestId },
      { status: response, respondedAt: new Date() },
    );
    return Response.json(
      { message: `Role request status updated to ${response}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing role request:", error);
    return Response.json(
      { error: "Error processing role request." },
      { status: 500 },
    );
  }
}
