import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import {
  refreshFacilities,
  refreshHarvestingBatches,
  refreshProductsStocks,
  setMachines,
  setProducts,
} from "@/store/production";

export default async function fillProductionRedux({ dispatch, router }) {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/productionManager");
    const batchesRes = await api.get("/harvesting-batches");
    const productionManager = res.data.productionManager;
    const harvestingBatches = batchesRes.data.harvestingBatches;

    dispatchPayloads({
      manager: productionManager,
      dispatch,
      batches: harvestingBatches,
    });
    dispatch(setLoading(false));
    return productionManager;
  } catch (error) {
    console.error("Error fetching production manager data:", error);
    handleError({
      ...error,
      generalMessage: "Greška pri dohvaćanju podataka o proizvodnji",
    });
  }
}

const dispatchPayloads = ({ manager, dispatch, batches }) => {
  console.log("Dispatching production manager data to Redux:", manager);
  dispatch(setProducts(manager.products));
  // dispatch(refreshProductsStocks.fulfilled(mapProductsStocks({ manager })));
  dispatch(refreshHarvestingBatches.fulfilled(batches));
  dispatch(refreshFacilities());
};

/* const mapProductsStocks = ({ manager }) => {
  return manager.products.map((product) => ({
    product: {
      name: product.name,
      description: product.description,
    },
    quantity: product.stock?.quantity,
    productionProcesses: product.stock?.productionProcesses,
  }));
};
 */
