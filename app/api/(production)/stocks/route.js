import { createProductStock, getStocks } from "@/lib/production/stocks";
import dbConnect from "@/lib/db/mongooseConnect";
import { PRODUCTION_STOCK } from "@/lib/constants/production";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";
import { acceptWarehouseStock } from "@/lib/warehouses/accept";
import { Product } from "@/models/sectors/production/Product";
import { ProductionStock } from "@/models/sectors/production/Facility";
import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";

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
  // route to add or create new stock
  try {
    await dbConnect();
    let {
      specificManager,
      worker: productionWorker,
      unauthorized,
    } = await fetchManagerWorker({
      managerNames: [PRODUCTION_MANAGER],
      workerType: managerMorkerMap[PRODUCTION_MANAGER],
    });

    if (unauthorized) {
      return Response.json({ unauthorized: true }, { status: 403 });
    }
    const stockType = req.nextUrl.searchParams.get("stockType");
    let stock;
    const body = await req.json();
    if (stockType == PRODUCTION_STOCK) {
      const { productionStock, productionProcess } =
        await createProductionStock({
          stockData: body.productionStockData,
        });

      return Response.json(
        { newProductionStock: productionStock, productionProcess },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (stockType == WAREHOUSE_STOCK) {
      const { warehouseStockData } = body;
      const product = await Product.findById(warehouseStockData.productId);
      const productionStock = await ProductionStock.findById(
        warehouseStockData.productionStockId,
      );
      if (productionStock.quantity < warehouseStockData.quantity) {
        return Response.json(
          {
            error:
              "Unesena količina je veća od dostupne količine na proizvodnoj zalihi.",
          },
          {
            status: 400,
          },
        );
      }

      const { warehouseStock, warehouseAcceptanceProcess } =
        await acceptWarehouseStock({
          product,
          quantity: warehouseStockData.quantity,
          productionStock,
          warehouseId: warehouseStockData.warehouseId,
          comment: warehouseStockData.comment,
          workerId: warehouseStockData.workerId,
        });
      return Response.json(
        { newWarehouseStock: warehouseStock, warehouseAcceptanceProcess },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }
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
  const {
    productId,
    quantity,
    batchName,
    comment,
    productionFacilityId,
    workerId,
  } = stockData;
  const { productionStock, productionProcess } = await createProductStock({
    productId,
    batchName,
    productionFacilityId,
    quantity,
    comment,
    workerId,
  });
  return { productionStock, productionProcess };
}
