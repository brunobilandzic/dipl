import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { Product } from "@/models/sectors/production/Products";

export const GET = async (req) => {
  try {
    await dbConnect();
    const { generalManager, specificManager } = await fetchManager({
      managerNames: [PRODUCTION_MANAGER, WAREHOUSE_MANAGER, FINANCIAL_MANAGER],
    });
    const products = await Product.find();

    return Response.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching managers:", error);
    return Response.json(
      { error: "Failed to fetch managers" },
      { status: 500 },
    );
  }
};
