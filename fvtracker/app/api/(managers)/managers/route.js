import mongoose from "mongoose";

export async function GET(req) {
  const { searchParams } = new URL(request.url);
  const managerType = searchParams.get("managerType");
  const managers = await mongoose
    .model(managerType)
    .find()
    .populate([
      {
        path: "rootManager",
        select: "appUser",
        populate: "appUser",
        select: "name surname",
      },
    ]);

  return Response.json({ managers });
}
