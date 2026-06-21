import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import {
  refreshFacilities,
  refreshHarvestingBatches,
  refreshProductsStocks,
  setProducts,
} from "@/store/production";
import { fetchWarehouses } from "@/store/warehouse";

export default async function fillProductionRedux({ dispatch, router, all }) {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/productionManager");
    if (all && res.data.productionManagers) {
      dispatch(
        setProducts(res.data.productionManagers.flatMap((pm) => pm.products)),
      );
      dispatch(refreshFacilities());
      dispatch(fetchWarehouses());
      dispatch(refreshProductsStocks());
      const batchesRes = await api.get("/harvesting-batches");
      const harvestingBatches = batchesRes.data.harvestingBatches;
      dispatch(refreshHarvestingBatches.fulfilled(harvestingBatches));
      return;
    }
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
  manager?.products && dispatch(setProducts(manager?.products));
  // dispatch(refreshProductsStocks.fulfilled(mapProductsStocks({ manager })));
  batches && dispatch(refreshHarvestingBatches.fulfilled(batches));
  dispatch(refreshFacilities());
  dispatch(fetchWarehouses());
  dispatch(refreshProductsStocks());
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
