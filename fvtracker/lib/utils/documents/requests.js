import api from "@/lib/api";
import { setLoading } from "@/store/loading";
import { fetchWarehouseRequests } from "@/store/warehouse";
import handleError from "@/lib/constants/errors/client/handleError";
import { financialPayWorker } from "@/store/workers";

export const fillWarehouseRequestsRedux = ({ dispatch }) => {
  dispatch(fetchWarehouseRequests());
};

export const sendWarehouseRequest = async ({
  requestData,
  dispatch,
  router,
}) => {
  try {
    dispatch(setLoading(true));
    const res = await api.post("/warehouse-requests", requestData);
    dispatch(financialPayWorker)
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    console.error("Error sending warehouse request:", error);
    handleError(
      { ...error, customMessage: "Greška prilikom slanja zahtjeva skladištu." },
      router,
    );
  }
};

export const warehouseRequestItems = (request) => {
  return request.order.items.map((item) => ({
    product: item.product.name,
    quantity: item.quantity,
  }));
};
