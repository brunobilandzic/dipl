import {
  fetchManager,
  isAuthorizedGeneralManager,
} from "@/lib/auth/fetchSessionData";
import { Field } from "@/models/sectors/cultivation/Field";
import dbConnect from "@/lib/db/mongooseConnect";
import fieldsPopulate from "../populate";

export async function GET(req) {
  await dbConnect();
  const isGeneralManager = await isAuthorizedGeneralManager();
  if (!isGeneralManager) {
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  }
  const fields = await Field.find().populate(fieldsPopulate);
  return Response.json({ fields }, { status: 200 });
}
