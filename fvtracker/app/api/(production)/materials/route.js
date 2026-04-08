import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getMaterials } from "@/lib/production/materials";

export async function GET() {
  try {
    await dbConnect();
    await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    const materials = await getMaterials();
    return Response.json({ materials }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
