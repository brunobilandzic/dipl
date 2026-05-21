import api from "@/lib/api";
import { fetchWarehouseRequests } from "@/store/warehouse";

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
