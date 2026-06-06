import mongoose from "mongoose";
import dbConnect from "@/lib/db/mongooseConnect";
import { findManagerName } from "./naming";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const managersType = searchParams.get("managersType");
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
