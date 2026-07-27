import {
  fetchManager,
  isAuthorizedGeneralManager,
} from "@/lib/auth/fetchSessionData";
import { Field } from "@/models/sectors/cultivation/Field";
import dbConnect from "@/lib/db/mongooseConnect";
import fieldsPopulate from "../populate";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(req) {
  await dbConnect();
  const { specificManager, generalManager, unauthorized } = await fetchManager({
    managerNames: [FINANCIAL_MANAGER],
  });
  if (
    unauthorized ||
    (generalManager && !isAuthorizedGeneralManager(generalManager))
  ) {
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  }
  const fields = await Field.find().populate(fieldsPopulate);
  return Response.json({ fields }, { status: 200 });
}
