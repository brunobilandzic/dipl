import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";
import cultivation from "@/lib/cultivation";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    await dbConnect();
    const cultivationManager = await auth.session.specificManager({
      managerName: "CultivationManager",
    });
    await cultivationManager.populate({
      path: "fields",
      populate: [
        {
          path: "cultivationAreas",
          populate: [
            {
              path: "cultivations",
              populate: {
                path: "plantedCropVarieties",
                populate: {
                  path: "plantingPlanItem",
                  populate: {
                    path: "cropVariety",
                    populate: { path: "cropType" },
                  },
                },
              },
            },
            { path: "field", select: "slug" },
          ],
        },
        {
          path: "plantingPlans",
          select: "-field",
          populate: [
            {
              path: "items",
              populate: [
                { path: "cropVariety", populate: { path: "cropType" } },
                { path: "plantedCropVarieties" },
              ],
            },
          ],
        },
      ],
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
