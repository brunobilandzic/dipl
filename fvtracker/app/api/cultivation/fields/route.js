import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  try {
    await dbConnect();
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    await cultivationManager.populate({
      path: "fields",
      populate: { path: "cultivationAreas" },
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
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
