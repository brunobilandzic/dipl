import auth from "@/lib/auth";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getGeneralManager } from "@/lib/generalManager";

export async function GET() {
  await dbConnect();
  try {
    const generalManager = await getGeneralManager();
    return Response.json({ generalManager }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Greška pri dohvaćanju Generalnog Managera" },
      { status: 500 },
    );
  }
}
