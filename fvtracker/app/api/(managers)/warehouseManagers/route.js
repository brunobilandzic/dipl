import { WarehouseManager } from "@/models/user/managers/WarehouseManager";

export async function GET(req) {
  const managers = await WarehouseManager.find().populate([
    {
      path: "rootManager",
      select: "appUser",
      populate: "appUser",
      select: "name surname",
    },
  ]);

  return Response.json({ managers });
}
