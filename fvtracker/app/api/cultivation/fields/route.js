import dbConnect from "@/lib/db/mongooseConnect";
import auth from "@/lib/auth";

export async function GET(request, { params }) {
  await dbConnect();
  console.log("Received GET request for field with params:", params);
  try {
    const cultivationManager =
      await auth.session.fetchSessionSpecificManager("CultivationManager");
    await cultivationManager.populate({
      path: "fields",
      populate: { path: "cultivationAreas" },
    });
    const slug = params?.slug;
    if (!slug) {
      return Response.json(cultivationManager.fields, { status: 200 });
    }
    const field = cultivationManager.fields.find((f) => f.slug === slug);
    if (!field) {
      return Response.json({ error: "Field not found" }, { status: 404 });
    }
    return Response.json(field, { status: 200 });
  } catch (error) {
    console.error("Error fetching field:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
