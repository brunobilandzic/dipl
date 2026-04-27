import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getFacilities } from "@/lib/production/facilities/get";
import { createFacility } from "@/lib/production/facilities/create";
import { updateFacility } from "@/lib/production/facilities/update";
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

export const POST = async (req) => {
  try {
    await dbConnect();
    const { unauthorized } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const body = await req.json();
    const facility = await createFacility(body);
    return Response.json({ facility }, { status: 201 });
  } catch (error) {
    console.error("Greška pri kreiranju postrojenja:", error);
    return Response.json(
      { error: "Greška pri kreiranju postrojenja" },
      { status: 500 },
    );
  }
};

export const PUT = async (req) => {
  try {
    await dbConnect();
    const { unauthorized } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    const facility = await updateFacility({ facilityId: id, data: body });
    return Response.json({ facility }, { status: 200 });
  } catch (error) {
    console.error("Greška pri ažuriranju postrojenja:", error);
    return Response.json(
      { error: "Greška pri ažuriranju postrojenja" },
      { status: 500 },
    );
  }
};

