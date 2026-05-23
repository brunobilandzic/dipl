import { fetchAdmin } from "@/lib/auth/fetchSessionData";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";

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

export async function POST(request) {
  try {
    const { unauthorized, admin } = await fetchAdmin({
      requireAdmin: true,
    });
    if (unauthorized) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    const request = await GeneralManagerRequest.findOne();
    request.status = ROLE_STATUSES.APPROVED;
    await request.save();
    console.log({ request });
    return Response.json({ message: "General manager request approved" });
  } catch (error) {
    console.error("Error approving general manager request:", error);
    return Response.json(
      { error: "Greška prilikom odobravanja zahteva za generalnog menadžera" },
      { status: 500 },
    );
  }
}
