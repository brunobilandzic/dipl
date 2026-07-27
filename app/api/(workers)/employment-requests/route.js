import { fetchManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import {
  FINANCIAL_MANAGER,
  MANAGER_TYPES,
} from "@/lib/constants/users/managerTypes";
import { EmploymentRequest } from "@/models/user/workers/EmploymentRequest";

export async function GET(request) {
  await dbConnect();
  const { unauthorized } = await fetchManager({
    managerNames: [FINANCIAL_MANAGER],
  });
  if (unauthorized) {
    return Response.json(
      { error: "Nemate pravo pristupa zahtjevima za zaposlenje" },
      { status: 403 },
    );
  }

  const employmentRequests = await EmploymentRequest.find().populate([
    {
      path: "worker",
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

export async function PUT(request) {
  await dbConnect();
  const { unauthorized } = await fetchManager({
    managerNames: MANAGER_TYPES,
  });
  if (unauthorized) {
    return Response.json(
      { error: "Nemate pravo pristupa zahtjevima za zaposlenje" },
      { status: 403 },
    );
  }
  const { requestId, status } = await request.json();
  await EmploymentRequest.findByIdAndUpdate(requestId, { status });
  return Response.json({ message: "Zahtjev uspješno ažuriran" });
}
