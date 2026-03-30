import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { RoleRequest } from "@/models/documents/requests/RoleRequest";

export async function PUT(req) {
  // do not mix req response with Next.js Response object
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: GENERAL_MANAGER });
    const { requestId, response } = await req.json();
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
