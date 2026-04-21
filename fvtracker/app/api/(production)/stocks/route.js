import { createProductStock, getStocks } from "@/lib/production/stocks";
import dbConnect from "@/lib/db/mongooseConnect";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      const stocks = await getStocks();
      return Response.json(
        { stocks },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.log("Error fetching stocks:", error);
    return Response.json(
      { error: error.message },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, quantity, batchName, comment, productionFacilityId } =
      body;
    const productionStock = await createProductStock({
      productId,
      batchName,
      productionFacilityId,
      quantity,
      comment,
    });

    return Response.json(
      { productionStock },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.log("Error creating production stock:", error);

    return Response.json(
      { error: error.message },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
