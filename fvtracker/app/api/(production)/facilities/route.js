import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getFacilities } from "@/lib/production/facilities/get";
import { createFacility } from "@/lib/production/facilities/create";
import { updateFacility } from "@/lib/production/facilities/update";
import { deleteFacilities } from "@/lib/production/facilities/delete";
import { makeUrlFriendly } from "@/lib/utils/strings";

export const GET = async (req) => {
  try {
    await dbConnect();
    const { unauthorized } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER, WAREHOUSE_MANAGER],
    });
    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug) {
      const facility = await getFacilities({ slug });
      return Response.json({ facility }, { status: 200 });
    }
    const facilities = await getFacilities({});
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
    const facility = await updateFacility({
      facilityId: id,
      data: { ...body, slug: makeUrlFriendly(body.name) },
    });
    return Response.json({ facility }, { status: 200 });
  } catch (error) {
    console.error("Greška pri ažuriranju postrojenja:", error);
    return Response.json(
      { error: "Greška pri ažuriranju postrojenja" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req) => {
  try {
    await dbConnect();
    const { unauthorized } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const idsString = req.nextUrl.searchParams.get("ids");
    const facilityIds = idsString.split(",");
    await deleteFacilities({ facilityIds });
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Greška pri brisanju postrojenja:", error);
    return Response.json(
      { error: "Greška pri brisanju postrojenja" },
      { status: 500 },
    );
  }
};
