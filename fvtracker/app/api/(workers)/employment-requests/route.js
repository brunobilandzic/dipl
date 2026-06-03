import { fetchManager } from "@/lib/auth/fetchSessionData";
import { EmploymentRequest } from "@/models/user/workers/EmploymentRequest";

export async function GET(request) {
  const { unauthorized } = await fetchManager();
  if (unauthorized) {
    return Response.json(
      { error: "Nemate pravo pristupa zahtjevima za zaposlenje" },
      { status: 403 },
    );
  }

  const employmentRequests = await EmploymentRequest.find().populate([
    {
      path: "manager",
      populate: [
        {
          path: "appUser",
          select: "name surname email username",
        },
      ],
    },
  ]);
  return Response.json({ requests: employmentRequests });
}
