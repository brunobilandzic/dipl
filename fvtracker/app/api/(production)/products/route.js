import dbConnect from "@/lib/db/mongooseConnect";
import { getProducts } from "@/lib/production/products";

export const GET = async (req) => {
  try {
    await dbConnect();
    const products = await getProducts();

    return Response.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching managers:", error);
    return Response.json(
      { error: "Failed to fetch managers" },
      { status: 500 },
    );
  }
};
