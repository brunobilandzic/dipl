import dbConnect from "@/lib/db/mongooseConnect";
import cultivation from "@/lib/cultivation";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { deleteFields } from "@/lib/cultivation/fields";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import { CultivationManager } from "@/models/user/managers/CultivationManager";
import fieldsPopulate from "./populate";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    await dbConnect();
    let { specificManager: cultivationManager, worker: cultivationWorker } =
      await fetchManagerWorker({
        managerNames: [CULTIVATION_MANAGER],
        workerType: managerMorkerMap[CULTIVATION_MANAGER],
      });
    if (cultivationWorker) {
      await cultivationWorker.populate({
        path: "manager",
        select: "managerModelName",
      });
      if (cultivationWorker.manager?.managerModelName !== CULTIVATION_MANAGER) {
        return Response.json(
          { message: "Unauthorized: Worker is not a cultivation worker" },
          { status: 403 },
        );
      }
      cultivationManager = await CultivationManager.findOne({
        rootManager: cultivationWorker.manager._id.toString(),
      });
    }

    if (!cultivationManager) {
      return Response.json(
        { message: "Unauthorized: No cultivation manager found" },
        { status: 403 },
      );
    }
    if (
      cultivationManager?.rootManager?.roleRequest?.status !=
        ROLE_STATUSES.APPROVED &&
      !cultivationWorker
    ) {
      return Response.json(
        { message: "Unauthorized: Role request not approved" },
        { status: 403 },
      );
    }
    await cultivationManager.populate({
      path: "fields",
      populate: fieldsPopulate,
    });

    if (slug) {
      const field = cultivationManager.fields.find((f) => f.slug === slug);
      if (!field) {
        return Response.json({ message: "Field not found" }, { status: 404 });
      }
      return Response.json({ field }, { status: 200 });
    } else {
      return Response.json(
        { fields: cultivationManager.fields },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const field = await cultivation.fields.create(body);
    return Response.json({ field }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { generalManager, specificManager } = await fetchManager({
      managerNames: [CULTIVATION_MANAGER],
    });
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      if (generalManager) {
        await deleteFields({});
      } else if (specificManager) {
        await deleteFields({ cultivationManager: specificManager._id });
      }
      return Response.json({ message: "Slug is required" }, { status: 400 });
    }

    const deletedField = await deleteFields({ slug });

    if (!deletedField) {
      return Response.json({ message: "Field not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Field deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
