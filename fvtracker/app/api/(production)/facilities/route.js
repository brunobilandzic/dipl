import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getFacilities } from "@/lib/production/facilities/get";
export const GET = async (req) => {
  try {
    await dbConnect();
    const { unauthorized } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER, WAREHOUSE_MANAGER],
    });
    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const facilities = await getFacilities();
    return Response.json({ facilities }, { status: 200 });
  } catch (error) {
    console.error("Greška pri dohvaćanju postrojenja:", error);
    return Response.json(
      { error: "Greška pri dohvaćanju postrojenja" },
      { status: 500 },
    );
  }
};

