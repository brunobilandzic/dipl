import { createProductStock, getStocks } from "@/lib/production/stocks";
import dbConnect from "@/lib/db/mongooseConnect";
import { PRODUCTION_STOCK } from "@/lib/constants/production";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";
import { acceptWarehouseStock } from "@/lib/warehouse/accept";
import { Product } from "@/models/sectors/production/Product";
import { ProductionStock } from "@/models/sectors/production/Facility";

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

export async function POST(req) {
  console.log("Received request to create stock");
  // route to add or create new stock
  try {
    await dbConnect();
    const stockType = req.nextUrl.searchParams.get("stockType");
    let stock;
    const body = await req.json();
    if (stockType == PRODUCTION_STOCK) {
      stock = await createProductionStock({
        stockData: body.productionStockData,
      });
      return Response.json(
        { stock },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (stockType == WAREHOUSE_STOCK) {
      const { warehouseStockData } = body;
      const product = await Product.findById(warehouseStockData.productId);
      const productionStock = await ProductionStock.findById(
        warehouseStockData.productionStock,
      );
      stock = await acceptWarehouseStock({
        product,
      });
      return Response.json(
        { stock },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log({ body });
  } catch (error) {
    console.log("Error creating stock:", error);

    return Response.json(
      { error: error.message },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function createProductionStock({ stockData }) {
  const { productId, quantity, batchName, comment, productionFacilityId } =
    stockData;
  const productionStock = await createProductStock({
    productId,
    batchName,
    productionFacilityId,
    quantity,
    comment,
  });
  return productionStock;
}
