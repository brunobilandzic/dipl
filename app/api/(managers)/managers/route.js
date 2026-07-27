import mongoose from "mongoose";
import dbConnect from "@/lib/db/mongooseConnect";
import { findManagerName } from "./naming";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const managersType = searchParams.get("managersType");
  const all = searchParams.get("all");
  if (all) {
    const rootManagers = await mongoose.models.RootManager.find({})
      .select("appUser")
      .populate({
        path: "appUser",
        select: "name surname",
      });
    return Response.json({ managers: rootManagers });
  }
  const managers = await mongoose
    .model(findManagerName({ managersType: managersType }))
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
