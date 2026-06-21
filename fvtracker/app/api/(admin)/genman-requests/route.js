import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { GeneralManager } from "@/models/user/managers/GeneralManager";

export async function GET(request) {
  try {
    await dbConnect();
    const { unauthorized, admin } = await fetchAdmin({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const generalManagerRequests = await GeneralManagerRequest.find(
      {},
    ).populate([
      {
        path: "generalManager",
        populate: {
          path: "rootManager",
          populate: {
            path: "appUser",
            select: "email name surname username",
          },
        },
      },
    ]);

    return Response.json({ generalManagerRequests });
  } catch (error) {
    console.error("Error fetching general manager requests:", error);
    return Response.json(
      { error: "Greška prilikom dohvatanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { unauthorized, admin } = await fetchAdmin({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await req.json();
    const { _id, status } = body;

    const requests = await GeneralManagerRequest.find();
    if (
      status === ROLE_STATUSES.APPROVED &&
      requests?.some((request) => request.status === ROLE_STATUSES.APPROVED)
    ) {
      return Response.json(
        { error: "Već postoji odobren zahtev za generalnog menadžera" },
        { status: 400 },
      );
    }

    const request = await GeneralManagerRequest.findById(_id);
    request.status = status;

    await request.save();
    return Response.json({ request, message: "Zahtjev odobren" });
  } catch (error) {
    console.error("Error approving general manager request:", error);
    return Response.json(
      { error: "Greška prilikom odobravanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}
