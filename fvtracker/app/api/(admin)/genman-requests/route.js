import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";
import { GeneralManager } from "@/models/user/managers/GeneralManager";

export async function GET(request) {
  try {
    const { unauthorized, admin } = await fetchSessionData({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const generalManagerRequests = await mongoose
      .model("GeneralManagerRequest")
      .find({ admin: admin._id })
      .populate("appUser", "name surname email");
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
    const { unauthorized, admin } = await fetchAdmin({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await req.json();
    console.log({ body });
    const { status } = body;

    const request = await GeneralManagerRequest.findOne();
    request.status = status;

    if (status == ROLE_STATUSES.REJECTED) {
      await GeneralManagerRequest.deleteMany();
      await GeneralManager.deleteMany();

      return Response.json({
        message: "Sve izbrisano, čekamo novi signup gneralnog menadzera.",
      });
    }
    await request.save();
    console.log({ request });
    return Response.json({ message: "Zahtjev odobren" });
  } catch (error) {
    console.error("Error approving general manager request:", error);
    return Response.json(
      { error: "Greška prilikom odobravanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}
