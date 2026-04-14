import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { setLoading } from "@/store/loading";
import { refreshProductsStocks, setProducts } from "@/store/production";

export default async function fillProductionRedux({ dispatch, router }) {
  try {
    dispatch(setLoading(true));
    console.log("Fetching production manager data...");
    const res = await api.get("/productionManager");
    const productionManager = res.data.productionManager;
    dispatchPayloads({ manager: productionManager, dispatch });
    console.log(productionManager);
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

const dispatchPayloads = ({ manager, dispatch }) => {
  console.log("Dispatching production manager data to Redux...");
  console.log(manager);
  dispatch(setProducts(manager.products));
  dispatch(refreshProductsStocks.fulfilled(mapProductsStocks({ manager })));
};

const mapProductsStocks = ({ manager }) => {
  return manager.products.map((product) => ({
    product: {
      name: product.name,
      description: product.description,
    },
    quantity: product.stock.quantity,
    productionProcesses: product.stock.productionProcesses,
  }));
};
